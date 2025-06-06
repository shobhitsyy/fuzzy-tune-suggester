
import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategory } from '@/utils/fuzzyLogic';
import { songDatabase } from '@/utils/songData';

export interface DatabaseSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  release_date: string;
  language: 'English' | 'Hindi';
  category: SongCategory;
  cover_image: string | null;
  duration: string;
  spotify_url: string | null;
  tags: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSongSimilarity {
  id: string;
  song_id: string;
  similar_song_id: string;
  created_at: string;
}

// Function to populate the database with initial song data
export const populateDatabase = async (): Promise<void> => {
  try {
    console.log('Starting to populate database with songs...');
    
    // First, insert all songs
    const songsToInsert = songDatabase.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      release_date: song.releaseDate,
      language: song.language,
      category: song.category,
      cover_image: song.coverImage,
      duration: song.duration,
      spotify_url: song.spotifyUrl || null,
      tags: song.tags,
      description: song.description
    }));

    const { error: songsError } = await supabase
      .from('songs')
      .upsert(songsToInsert, { onConflict: 'id' });

    if (songsError) {
      console.error('Error inserting songs:', songsError);
      throw songsError;
    }

    console.log('Songs inserted successfully');

    // Then, insert song similarities
    const similaritiesToInsert: { song_id: string; similar_song_id: string }[] = [];
    
    songDatabase.forEach(song => {
      if (song.similarSongs) {
        song.similarSongs.forEach(similarSongId => {
          similaritiesToInsert.push({
            song_id: song.id,
            similar_song_id: similarSongId
          });
        });
      }
    });

    if (similaritiesToInsert.length > 0) {
      const { error: similaritiesError } = await supabase
        .from('song_similarities')
        .upsert(similaritiesToInsert, { onConflict: 'song_id,similar_song_id' });

      if (similaritiesError) {
        console.error('Error inserting song similarities:', similaritiesError);
        throw similaritiesError;
      }
    }

    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
};

// Get songs by category and language
export const getSongsByCategory = async (
  category: SongCategory, 
  language?: 'English' | 'Hindi'
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

    return data?.map(transformDatabaseSongToSong) || [];
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

    if (similarityError) {
      console.error('Error fetching song similarities:', similarityError);
      throw similarityError;
    }

    if (!similarities || similarities.length === 0) {
      return [];
    }

    const similarSongIds = similarities.map(s => s.similar_song_id);
    
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .in('id', similarSongIds);

    if (songsError) {
      console.error('Error fetching similar songs:', songsError);
      throw songsError;
    }

    return songs?.map(transformDatabaseSongToSong) || [];
  } catch (error) {
    console.error('Error in getSimilarSongs:', error);
    return [];
  }
};

// Get random songs by category
export const getRandomSongsByCategory = async (
  category: SongCategory, 
  count: number = 3, 
  language?: 'English' | 'Hindi'
): Promise<Song[]> => {
  try {
    let query = supabase
      .from('songs')
      .select('*')
      .eq('category', category);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query.limit(count);

    if (error) {
      console.error('Error fetching random songs:', error);
      throw error;
    }

    // Shuffle the results
    const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
    return shuffled.slice(0, count).map(transformDatabaseSongToSong);
  } catch (error) {
    console.error('Error in getRandomSongsByCategory:', error);
    return [];
  }
};

// Get recommended songs based on multiple categories and membership values
export const getRecommendedSongs = async (
  primaryCategory: SongCategory,
  memberships: Record<SongCategory, number>,
  count: number = 5,
  includeEnglish: boolean = true,
  includeHindi: boolean = true
): Promise<Song[]> => {
  try {
    let languages: ('English' | 'Hindi')[] = [];
    if (includeEnglish) languages.push('English');
    if (includeHindi) languages.push('Hindi');

    // Get songs from primary category first
    let query = supabase
      .from('songs')
      .select('*')
      .eq('category', primaryCategory);

    if (languages.length > 0) {
      query = query.in('language', languages);
    }

    const { data: primarySongs, error: primaryError } = await query;

    if (primaryError) {
      console.error('Error fetching primary songs:', primaryError);
      throw primaryError;
    }

    let allSongs = primarySongs || [];

    // If we don't have enough songs, get from other categories
    if (allSongs.length < count) {
      const sortedCategories = Object.entries(memberships)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat as SongCategory)
        .filter(cat => cat !== primaryCategory);

      for (const category of sortedCategories) {
        if (allSongs.length >= count) break;

        let additionalQuery = supabase
          .from('songs')
          .select('*')
          .eq('category', category);

        if (languages.length > 0) {
          additionalQuery = additionalQuery.in('language', languages);
        }

        const { data: additionalSongs } = await additionalQuery;
        
        if (additionalSongs) {
          allSongs = [...allSongs, ...additionalSongs];
        }
      }
    }

    // Shuffle and limit results
    const shuffled = allSongs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(transformDatabaseSongToSong);
  } catch (error) {
    console.error('Error in getRecommendedSongs:', error);
    return [];
  }
};

// Transform database song to application song format
const transformDatabaseSongToSong = (dbSong: DatabaseSong): Song => {
  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    album: dbSong.album,
    releaseDate: dbSong.release_date,
    language: dbSong.language,
    category: dbSong.category,
    coverImage: dbSong.cover_image || '',
    duration: dbSong.duration,
    spotifyUrl: dbSong.spotify_url || undefined,
    similarSongs: [], // This will be populated separately if needed
    tags: dbSong.tags,
    description: dbSong.description || ''
  };
};

// Check if database is populated
export const isDatabasePopulated = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking database population:', error);
      return false;
    }

    return (count || 0) > 0;
  } catch (error) {
    console.error('Error in isDatabasePopulated:', error);
    return false;
  }
};
