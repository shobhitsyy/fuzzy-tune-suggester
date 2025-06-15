
import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategoryType } from '@/utils/fuzzyLogic';

export interface DatabaseSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  release_date: string;
  language: string; // Allow any string from the database
  category: string;
  cover_image: string | null;
  duration: string;
  spotify_url: string | null;
  tags: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Get recommended songs based on multiple categories and membership values
export const getRecommendedSongs = async (
  primaryCategory: SongCategoryType,
  memberships: Record<SongCategoryType, number>,
  count: number = 20,
  includeEnglish: boolean = true,
  includeHindi: boolean = true
): Promise<Song[]> => {
  try {
    console.log('Getting recommended songs:', {
      primaryCategory,
      memberships,
      count,
      includeEnglish,
      includeHindi
    });

    let languages: ('English' | 'Hindi')[] = [];
    if (includeEnglish) languages.push('English');
    if (includeHindi) languages.push('Hindi');

    if (languages.length === 0) {
      console.log('No languages selected');
      return [];
    }

    // Build query with language filter
    let query = supabase
      .from('songs')
      .select('*');

    if (languages.length === 1) {
      query = query.eq('language', languages[0]);
    } else if (languages.length === 2) {
      query = query.in('language', languages);
    }

    const { data: allSongs, error } = await query;

    if (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }

    if (!allSongs || allSongs.length === 0) {
      console.log('No songs found in database');
      return [];
    }

    console.log('Total songs available:', allSongs.length);

    // Sort categories by membership values (highest preference first)
    const sortedCategories = Object.entries(memberships)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat as SongCategoryType);

    console.log('Categories sorted by preference:', sortedCategories);

    let resultSongs: typeof allSongs = [];

    // First, add songs from primary category
    const primarySongs = allSongs.filter(song => song.category === primaryCategory);
    resultSongs.push(...primarySongs);
    console.log(`Added ${primarySongs.length} songs from primary category: ${primaryCategory}`);

    // Then add from other categories in order of preference
    for (const category of sortedCategories) {
      if (category !== primaryCategory && resultSongs.length < count) {
        const categorySongs = allSongs.filter(song => 
          song.category === category && 
          !resultSongs.some(existing => existing.id === song.id)
        );
        resultSongs.push(...categorySongs);
        console.log(`Added ${categorySongs.length} songs from category: ${category}`);
      }
    }

    // If we still don't have enough songs, add remaining songs
    if (resultSongs.length < count) {
      const remainingSongs = allSongs.filter(song => 
        !resultSongs.some(existing => existing.id === song.id)
      );
      resultSongs.push(...remainingSongs);
      console.log(`Added ${remainingSongs.length} remaining songs`);
    }

    // Shuffle and limit results
    const shuffled = resultSongs.sort(() => 0.5 - Math.random());
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    
    console.log('Final recommended songs:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getRecommendedSongs:', error);
    return [];
  }
};

// Transform database song to application song format
const transformDatabaseSongToSong = (dbSong: DatabaseSong): Song => {
  // Accept string `language` and cast to union (or fallback to 'English')
  let language: "English" | "Hindi" = dbSong.language === "Hindi" ? "Hindi" : "English";
  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    album: dbSong.album,
    releaseDate: dbSong.release_date,
    language,
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
    return (data ?? []).map(transformDatabaseSongToSong);
  } catch (error) {
    console.error('Error in getSongsByCategory:', error);
    return [];
  }
};

// Get songs by the same artist, excluding the current song
export const getSimilarSongsByArtist = async (
  songId: string,
  artist: string,
  limit: number = 3
): Promise<Song[]> => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('artist', artist)
      .neq('id', songId)
      .limit(limit);

    if (error) {
      console.error('Error fetching similar songs by artist:', error);
      return [];
    }

    return (data ?? []).map(transformDatabaseSongToSong);
  } catch (error) {
    console.error('Error in getSimilarSongsByArtist:', error);
    return [];
  }
};

// Check if database has songs
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

// Get random songs by category
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

    const { data, error } = await query.limit(count * 2); // Get more to shuffle

    if (error) {
      console.error('Error fetching random songs:', error);
      throw error;
    }

    // Shuffle the results
    const shuffled = (data ?? []).sort(() => 0.5 - Math.random());
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    console.log('Random songs fetched:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getRandomSongsByCategory:', error);
    return [];
  }
};

