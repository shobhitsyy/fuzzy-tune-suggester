
import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategoryType } from '@/utils/fuzzyLogic';

// For DB output, language/category are string - then cast appropriately
export interface DatabaseSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  release_date: string;
  language: string; // changed from 'English' | 'Hindi' to string
  category: string; // changed from SongCategoryType to string
  cover_image: string | null;
  duration: string;
  spotify_url: string | null;
  tags: string[] | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const getRecommendedSongs = async (
  primaryCategory: SongCategoryType,
  memberships: Record<SongCategoryType, number>,
  count: number = 1000,
  includeEnglish: boolean = true,
  includeHindi: boolean = true
) => {
  try {
    let languages: string[] = [];
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

    let resultSongs: DatabaseSong[] = [];
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
    const shuffled = resultSongs.sort(() => 0.5 - Math.random());
    const result = shuffled.map(transformDatabaseSongToSong);
    return result;
  } catch (error) {
    return [];
  }
};

// Transform DB result to app Song model
const transformDatabaseSongToSong = (dbSong: DatabaseSong): Song => {
  // Strictly cast to expected types, fallback/default if needed
  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    album: dbSong.album,
    releaseDate: dbSong.release_date,
    language: dbSong.language === "English" || dbSong.language === "Hindi" ? dbSong.language : "English",
    category: dbSong.category as SongCategoryType,
    coverImage: dbSong.cover_image || '/placeholder.svg',
    duration: dbSong.duration,
    spotifyUrl: dbSong.spotify_url || undefined,
    similarSongs: [],
    tags: dbSong.tags || [],
    description: dbSong.description || ''
  };
};

// Get songs by category and language
export const getSongsByCategory = async (
  category: SongCategoryType, 
  language?: string // match DB
): Promise<Song[]> => {
  try {
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

    return (data as DatabaseSong[])?.map(transformDatabaseSongToSong) || [];
  } catch (error) {
    console.error('Error in getSongsByCategory:', error);
    return [];
  }
};

// Get similar songs for a given song ID
export const getSimilarSongs = async (songId: string, limit: number = 3): Promise<Song[]> => {
  try {
    const { data: similarities, error: similarityError } = await supabase
      .from('song_similarities')
      .select('similar_song_id')
      .eq('song_id', songId)
      .limit(limit);

    if (similarityError) throw similarityError;
    if (!similarities || similarities.length === 0) return [];

    const similarSongIds = similarities.map(s => s.similar_song_id).filter(Boolean);
    if (similarSongIds.length === 0) return [];
    
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .in('id', similarSongIds);

    if (songsError) throw songsError;
    return (songs as DatabaseSong[])?.map(transformDatabaseSongToSong) || [];
  } catch (error) {
    console.error('Error in getSimilarSongs:', error);
    return [];
  }
};

// Check if database has songs
export const isDatabasePopulated = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (error) return false;

    return (count || 0) > 0;
  } catch (error) {
    return false;
  }
};

// Get random songs by category
export const getRandomSongsByCategory = async (
  category: SongCategoryType, 
  count: number = 3, 
  language?: string // match DB
): Promise<Song[]> => {
  try {
    let query = supabase
      .from('songs')
      .select('*')
      .eq('category', category);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query.limit(count * 2);

    if (error) throw error;

    const shuffled = (data as DatabaseSong[])?.sort(() => 0.5 - Math.random()) || [];
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    return result;
  } catch (error) {
    return [];
  }
};
