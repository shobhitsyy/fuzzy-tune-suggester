import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategoryType } from '@/utils/fuzzyLogic';

export interface DatabaseSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  release_date: string;
  language: 'English' | 'Hindi';
  category: SongCategoryType;
  cover_image: string | null;
  duration: string;
  spotify_url: string | null;
  tags: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

const VALID_LANGUAGES = ['English', 'Hindi'] as const;
const VALID_CATEGORIES = [
  'upbeat', 'party', 'uplifting', 'motivational', 'calm', 'relaxing', 'romantic',
  'nostalgic', 'happy', 'melancholic', 'study', 'sad'
] as const;

export const getRecommendedSongs = async (
  primaryCategory: SongCategoryType,
  memberships: Record<SongCategoryType, number>,
  count: number = 1000,
  includeEnglish: boolean = true,
  includeHindi: boolean = true
) => {
  try {
    let languages: ('English' | 'Hindi')[] = [];
    if (includeEnglish) languages.push('English');
    if (includeHindi) languages.push('Hindi');
    if (!languages.length) return [];

    let query = supabase
      .from('songs')
      .select('*');
    if (languages.length === 1) {
      query = query.eq('language', languages[0]);
    } else if (languages.length === 2) {
      query = query.in('language', languages);
    }
    const { data: allSongs, error } = await query;
    if (error || !allSongs?.length) return [];

    const sortedCategories = Object.entries(memberships)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat[0] as SongCategoryType);

    let resultSongs: typeof allSongs = [];
    const primarySongs = allSongs.filter(song => song.category === primaryCategory);
    resultSongs.push(...primarySongs);
    for (const category of sortedCategories) {
      if (category !== primaryCategory && resultSongs.length < count) {
        const categorySongs = allSongs.filter(song => 
          song.category === category && 
          !resultSongs.some(existing => existing.id === song.id)
        );
        resultSongs.push(...categorySongs);
      }
    }
    if (resultSongs.length < count) {
      const remainingSongs = allSongs.filter(song => 
        !resultSongs.some(existing => existing.id === song.id)
      );
      resultSongs.push(...remainingSongs);
    }
    // Shuffle and limit only if needed
    const shuffled = resultSongs.sort(() => 0.5 - Math.random());
    // Remove slice/count limitation - return all
    const result = shuffled.map(transformDatabaseSongToSong);
    return result;
  } catch (error) {
    return [];
  }
};

// Transform database song to application song format
const transformDatabaseSongToSong = (dbSong: any): Song => {
  // Force types to union type or use fallback
  let language: 'English' | 'Hindi' = VALID_LANGUAGES.includes(dbSong.language) ? dbSong.language : 'English';
  let category: SongCategoryType = VALID_CATEGORIES.includes(dbSong.category) ? dbSong.category : 'upbeat';

  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    album: dbSong.album,
    releaseDate: dbSong.release_date,
    language,
    category,
    coverImage: dbSong.cover_image || '/placeholder.svg',
    duration: dbSong.duration,
    spotifyUrl: dbSong.spotify_url || undefined,
    similarSongs: [],
    tags: dbSong.tags || [],
    description: dbSong.description || ''
  };
};

export const getSongsByCategory = async (
  category: SongCategoryType, 
  language?: 'English' | 'Hindi'
): Promise<Song[]> => {
  try {
    console.log('Fetching songs by category:', category, 'language:', language);
    
    let query = supabase
      .from('songs')
      .select('*')
      .eq('category', category);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching songs by category:', error);
      throw error;
    }

    console.log('Songs fetched:', data?.length || 0);
    return data?.map(transformDatabaseSongToSong) || [];
  } catch (error) {
    console.error('Error in getSongsByCategory:', error);
    return [];
  }
};

export const getSimilarSongs = async (songId: string, limit: number = 3): Promise<Song[]> => {
  try {
    console.log('Fetching similar songs for:', songId);
    
    const { data: similarities, error: similarityError } = await supabase
      .from('song_similarities')
      .select('similar_song_id')
      .eq('song_id', songId)
      .limit(limit);

    if (similarityError) {
      console.error('Error fetching song similarities:', similarityError);
      throw similarityError;
    }

    if (!similarities || similarities.length === 0) {
      console.log('No similarities found for song:', songId);
      return [];
    }

    const similarSongIds = similarities.map((s: any) => s.similar_song_id).filter(Boolean);
    
    if (similarSongIds.length === 0) {
      return [];
    }
    
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .in('id', similarSongIds);

    if (songsError) {
      console.error('Error fetching similar songs:', songsError);
      throw songsError;
    }

    console.log('Similar songs fetched:', songs?.length || 0);
    return songs?.map(transformDatabaseSongToSong) || [];
  } catch (error) {
    console.error('Error in getSimilarSongs:', error);
    return [];
  }
};

export const isDatabasePopulated = async (): Promise<boolean> => {
  try {
    console.log('Checking if database has songs...');
    
    const { count, error } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking database:', error);
      return false;
    }

    const isPopulated = (count || 0) > 0;
    console.log('Database check result:', isPopulated, 'songs count:', count);
    return isPopulated;
  } catch (error) {
    console.error('Error in isDatabasePopulated:', error);
    return false;
  }
};

export const getRandomSongsByCategory = async (
  category: SongCategoryType, 
  count: number = 3, 
  language?: 'English' | 'Hindi'
): Promise<Song[]> => {
  try {
    console.log('Fetching random songs by category:', category, 'count:', count, 'language:', language);
    
    let query = supabase
      .from('songs')
      .select('*')
      .eq('category', category);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query.limit(count * 2);

    if (error) {
      console.error('Error fetching random songs:', error);
      throw error;
    }

    const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    console.log('Random songs fetched:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getRandomSongsByCategory:', error);
    return [];
  }
};
