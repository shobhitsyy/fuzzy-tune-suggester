
import { spotifyService } from './spotifyService';
import { supabase } from '@/integrations/supabase/client';
import { SongCategoryType } from '@/utils/fuzzyLogic';

// Audio features mapping to our song categories
const getAudioFeatureCategories = (features: any): SongCategoryType[] => {
  const categories: SongCategoryType[] = [];
  
  // High energy + high valence = energetic
  if (features.energy > 0.7 && features.valence > 0.6) {
    categories.push('energetic');
  }
  
  // Medium energy + high valence = upbeat
  if (features.energy > 0.5 && features.energy <= 0.7 && features.valence > 0.5) {
    categories.push('upbeat');
  }
  
  // Medium energy + medium valence = moderate
  if (features.energy > 0.3 && features.energy <= 0.6 && features.valence > 0.3 && features.valence <= 0.6) {
    categories.push('moderate');
  }
  
  // Low energy + medium valence = relaxed
  if (features.energy <= 0.4 && features.valence > 0.3 && features.valence <= 0.6) {
    categories.push('relaxed');
  }
  
  // Low energy + low valence = calm
  if (features.energy <= 0.3 && features.valence <= 0.4) {
    categories.push('calm');
  }
  
  // Default to moderate if no category matches
  return categories.length > 0 ? categories : ['moderate'];
};

// Search for songs on Spotify and get their data
const searchSpotifyForSong = async (title: string, artist: string) => {
  try {
    const query = `track:"${title}" artist:"${artist}"`;
    const results = await spotifyService.searchTracks({ mood: query, limit: 1 });
    
    if (results && results.length > 0) {
      const track = results[0];
      return {
        spotifyId: track.id,
        spotifyUrl: track.external_urls?.spotify,
        coverImage: track.album?.images?.[0]?.url || '/placeholder.svg',
        audioFeatures: await spotifyService.getAudioFeatures([track.id])
      };
    }
  } catch (error) {
    console.error('Error searching Spotify:', error);
  }
  return null;
};

// Enrich existing songs with Spotify data
export const enrichExistingSongs = async (batchSize: number = 50) => {
  const results = { updated: 0, newSongs: 0, errors: 0 };
  
  try {
    // Get songs that don't have Spotify data
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .is('spotify_url', null)
      .limit(batchSize);

    if (error) throw error;

    for (const song of songs || []) {
      try {
        const spotifyData = await searchSpotifyForSong(song.title, song.artist);
        
        if (spotifyData) {
          // Determine categories based on audio features
          const categories = spotifyData.audioFeatures && spotifyData.audioFeatures[0]
            ? getAudioFeatureCategories(spotifyData.audioFeatures[0])
            : [song.category];

          // Update the song with Spotify data
          const { error: updateError } = await supabase
            .from('songs')
            .update({
              spotify_url: spotifyData.spotifyUrl,
              cover_image: spotifyData.coverImage,
              category: categories[0] // Use primary category
            })
            .eq('id', song.id);

          if (!updateError) {
            results.updated++;
          } else {
            results.errors++;
            console.error('Error updating song:', updateError);
          }
        }
      } catch (error) {
        results.errors++;
        console.error('Error processing song:', song.title, error);
      }
    }
  } catch (error) {
    console.error('Error enriching songs:', error);
    throw error;
  }

  return results;
};

// Category-specific search terms for discovering new songs
const categorySearchTerms: Record<SongCategoryType, string[]> = {
  'calm': ['meditation', 'ambient', 'peaceful', 'sleep', 'chill', 'spa'],
  'relaxed': ['acoustic', 'soft rock', 'folk', 'indie', 'mellow'],
  'moderate': ['pop', 'alternative', 'indie pop', 'soft rock'],
  'upbeat': ['dance', 'pop', 'funk', 'disco', 'party'],
  'energetic': ['rock', 'electronic', 'workout', 'pump up', 'high energy']
};

// Discover new songs for a specific category
const discoverSongsForCategory = async (category: SongCategoryType, limit: number = 20) => {
  const results = { updated: 0, newSongs: 0, errors: 0 };
  
  try {
    const searchTerms = categorySearchTerms[category];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    // Search for tracks
    const searchResults = await spotifyService.searchTracks({ mood: randomTerm, limit });
    
    const tracksToProcess = searchResults ? searchResults.slice(0, limit) : [];
    
    for (const track of tracksToProcess) {
      try {
        // Check if song already exists
        const { data: existingSong } = await supabase
          .from('songs')
          .select('id')
          .eq('title', track.name)
          .eq('artist', track.artists?.[0]?.name || 'Unknown Artist')
          .single();

        if (!existingSong) {
          // Get audio features to better categorize
          const audioFeatures = await spotifyService.getAudioFeatures([track.id]);
          const categories = audioFeatures && audioFeatures[0] ? getAudioFeatureCategories(audioFeatures[0]) : [category];
          
          // Generate unique ID
          const songId = `spotify-${track.id}`;
          
          // Add new song
          const { error: insertError } = await supabase
            .from('songs')
            .insert({
              id: songId,
              title: track.name,
              artist: track.artists?.[0]?.name || 'Unknown Artist',
              album: track.album?.name || 'Unknown Album',
              release_date: '2023-01-01', // Default date since Spotify API might not provide this
              language: 'English', // Default for Spotify tracks
              category: categories[0],
              cover_image: track.album?.images?.[0]?.url || '/placeholder.svg',
              duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
              spotify_url: track.external_urls?.spotify,
              tags: [category, track.artists?.[0]?.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'],
              description: `${track.name} by ${track.artists?.[0]?.name || 'Unknown Artist'} - A ${category} track perfect for your mood.`
            });

          if (!insertError) {
            results.newSongs++;
          } else {
            results.errors++;
            console.error('Error inserting song:', insertError);
          }
        } else {
          results.updated++;
        }
      } catch (error) {
        results.errors++;
        console.error('Error processing track:', track.name, error);
      }
    }
  } catch (error) {
    console.error(`Error discovering songs for ${category}:`, error);
    throw error;
  }

  return results;
};

// Update all categories with new songs
export const updateAllCategories = async () => {
  const categoryResults: Record<SongCategoryType, any> = {} as Record<SongCategoryType, any>;
  
  const categories: SongCategoryType[] = ['calm', 'relaxed', 'moderate', 'upbeat', 'energetic'];
  
  for (const category of categories) {
    try {
      categoryResults[category] = await discoverSongsForCategory(category, 10);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error updating category ${category}:`, error);
      categoryResults[category] = { updated: 0, newSongs: 0, errors: 1 };
    }
  }
  
  return categoryResults;
};

export const spotifyDatabaseService = {
  enrichExistingSongs,
  updateAllCategories,
  discoverSongsForCategory
};
