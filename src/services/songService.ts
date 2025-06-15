
import { supabase } from '@/integrations/supabase/client';
import { Song, SongCategoryType } from '@/utils/fuzzyLogic';
import { songDatabase } from '@/utils/songData';
import { allAdditionalSongs } from '@/utils/additionalSongs';

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
    
    // Combine all song collections
    const allSongs = [
      ...songDatabase,
      ...allAdditionalSongs
    ];

    console.log('Total songs to insert:', allSongs.length);

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

    console.log('Prepared songs for insertion:', songsToInsert.length);
    
    // Insert in batches to avoid timeout
    const batchSize = 10;
    let totalInserted = 0;
    
    for (let i = 0; i < songsToInsert.length; i += batchSize) {
      const batch = songsToInsert.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} with ${batch.length} songs`);
      
      const { data: insertedSongs, error: songsError } = await supabase
        .from('songs')
        .upsert(batch, { onConflict: 'id' })
        .select();

      if (songsError) {
        console.error('Error inserting song batch:', songsError);
        throw songsError;
      }

      totalInserted += insertedSongs?.length || 0;
      console.log(`Batch ${Math.floor(i/batchSize) + 1} inserted successfully:`, insertedSongs?.length || 0);
    }

    console.log(`Successfully inserted ${totalInserted} songs total`);

    // Verify insertion
    const { count: finalCount } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    console.log('Final song count in database:', finalCount);

    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
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
    const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
    const result = shuffled.slice(0, count).map(transformDatabaseSongToSong);
    console.log('Random songs fetched:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getRandomSongsByCategory:', error);
    return [];
  }
};

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

    // First check if we have any songs at all
    const { count: totalSongs } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    console.log('Total songs in database:', totalSongs);

    if (!totalSongs || totalSongs === 0) {
      console.log('No songs found in database, attempting to populate...');
      await populateDatabase();
      // Try again after population
      const { count: newCount } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });
      console.log('Songs after population:', newCount);
    }

    // Get songs from all categories and then filter/sort
    let query = supabase
      .from('songs')
      .select('*');

    if (languages.length > 0) {
      query = query.in('language', languages);
    }

    const { data: allSongs, error } = await query;

    if (error) {
      console.error('Error fetching all songs:', error);
      throw error;
    }

    if (!allSongs || allSongs.length === 0) {
      console.log('No songs found even after population attempt');
      return [];
    }

    console.log('Total songs available:', allSongs.length);

    // Sort categories by membership values
    const sortedCategories = Object.entries(memberships)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat as SongCategoryType);

    console.log('Categories sorted by preference:', sortedCategories);

    // Filter and prioritize songs
    let resultSongs: typeof allSongs = [];

    // First add songs from primary category
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
  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    album: dbSong.album,
    releaseDate: dbSong.release_date,
    language: dbSong.language,
    category: dbSong.category,
    coverImage: dbSong.cover_image || '/placeholder.svg',
    duration: dbSong.duration,
    spotifyUrl: dbSong.spotify_url || undefined,
    similarSongs: [],
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
