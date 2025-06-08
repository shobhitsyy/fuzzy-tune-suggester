import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategory } from '@/utils/fuzzyLogic';
import { songDatabase } from '@/utils/songData';
import { 
  additionalSongs, 
  additionalHindiSongs, 
  additionalRelaxedSongs, 
  additionalModerateSongs, 
  additionalUpbeatSongs, 
  additionalEnergeticSongs 
} from '@/utils/additionalSongs';

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
    
    // First, check if data already exists
    const { count: existingSongsCount } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (existingSongsCount && existingSongsCount >= 100) {
      console.log('Database already has 100+ songs, skipping population');
      return;
    }
    
    // Combine all song collections
    const allSongs = [
      ...songDatabase,
      ...additionalSongs,
      ...additionalHindiSongs,
      ...additionalRelaxedSongs,
      ...additionalModerateSongs,
      ...additionalUpbeatSongs,
      ...additionalEnergeticSongs
    ];

    // Insert all songs
    const songsToInsert = allSongs.map(song => ({
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

    console.log('Inserting songs:', songsToInsert.length);
    
    // Insert in batches to avoid timeout
    const batchSize = 20;
    for (let i = 0; i < songsToInsert.length; i += batchSize) {
      const batch = songsToInsert.slice(i, i + batchSize);
      const { data: insertedSongs, error: songsError } = await supabase
        .from('songs')
        .upsert(batch, { onConflict: 'id' })
        .select();

      if (songsError) {
        console.error('Error inserting song batch:', songsError);
        throw songsError;
      }

      console.log(`Batch ${Math.floor(i/batchSize) + 1} inserted successfully:`, insertedSongs?.length || 0);
    }

    // Create comprehensive similarity relationships
    const similaritiesToInsert: { song_id: string; similar_song_id: string }[] = [];
    
    // Generate similarities for all songs
    allSongs.forEach(song => {
      const similarSongs = allSongs
        .filter(otherSong => 
          otherSong.id !== song.id && 
          (otherSong.category === song.category || 
           Math.abs(getSimilarityScore(song, otherSong)) > 0.7)
        )
        .slice(0, 3); // Limit to 3 similar songs per song

      similarSongs.forEach(similarSong => {
        similaritiesToInsert.push({
          song_id: song.id,
          similar_song_id: similarSong.id
        });
      });
    });

    if (similaritiesToInsert.length > 0) {
      console.log('Inserting similarities:', similaritiesToInsert.length);
      
      // Insert similarities in batches
      for (let i = 0; i < similaritiesToInsert.length; i += batchSize) {
        const batch = similaritiesToInsert.slice(i, i + batchSize);
        const { data: insertedSimilarities, error: similaritiesError } = await supabase
          .from('song_similarities')
          .upsert(batch, { onConflict: 'song_id,similar_song_id' })
          .select();

        if (similaritiesError) {
          console.error('Error inserting similarity batch:', similaritiesError);
          throw similaritiesError;
        }

        console.log(`Similarity batch ${Math.floor(i/batchSize) + 1} inserted:`, insertedSimilarities?.length || 0);
      }
    }

    console.log('Database populated successfully with 100+ songs');
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
};

// Helper function to calculate similarity score
const getSimilarityScore = (song1: any, song2: any): number => {
  let score = 0;
  
  // Same language
  if (song1.language === song2.language) score += 0.3;
  
  // Similar tags
  const commonTags = song1.tags.filter((tag: string) => song2.tags.includes(tag));
  score += (commonTags.length / Math.max(song1.tags.length, song2.tags.length)) * 0.4;
  
  // Same category
  if (song1.category === song2.category) score += 0.3;
  
  return score;
};

// Get songs by category and language
export const getSongsByCategory = async (
  category: SongCategory, 
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

// Get similar songs for a given song ID
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

    const similarSongIds = similarities.map(s => s.similar_song_id).filter(Boolean);
    
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

// Get random songs by category
export const getRandomSongsByCategory = async (
  category: SongCategory, 
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
    const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    console.log('Random songs fetched:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getRandomSongsByCategory:', error);
    return [];
  }
};

// Get recommended songs based on multiple categories and membership values - Updated to return 20 songs
export const getRecommendedSongs = async (
  primaryCategory: SongCategory,
  memberships: Record<SongCategory, number>,
  count: number = 20, // Increased default to 20
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
    console.log('Primary songs found:', allSongs.length);

    // If we don't have enough songs, get from other categories
    if (allSongs.length < count) {
      const sortedCategories = Object.entries(memberships)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat as SongCategory)
        .filter(cat => cat !== primaryCategory);

      console.log('Getting additional songs from categories:', sortedCategories);

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
          console.log('Additional songs from', category, ':', additionalSongs.length);
        }
      }
    }

    // Remove duplicates by id
    const uniqueSongs = allSongs.filter((song, index, self) => 
      index === self.findIndex(s => s.id === song.id)
    );

    // Shuffle and limit results
    const shuffled = uniqueSongs.sort(() => 0.5 - Math.random());
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
    console.log('Checking if database is populated...');
    
    const { count, error } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking database population:', error);
      return false;
    }

    const isPopulated = (count || 0) > 0;
    console.log('Database populated check:', isPopulated, 'songs count:', count);
    return isPopulated;
  } catch (error) {
    console.error('Error in isDatabasePopulated:', error);
    return false;
  }
};
