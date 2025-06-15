
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

// Curated list of popular songs to add to the database
const curatedSongs = {
  english: [
    { name: "Blinding Lights", artist: "The Weeknd" },
    { name: "Watermelon Sugar", artist: "Harry Styles" },
    { name: "Levitating", artist: "Dua Lipa" },
    { name: "Good 4 U", artist: "Olivia Rodrigo" },
    { name: "Stay", artist: "The Kid LAROI" }
  ],
  hindi: [
    { name: "Kesariya", artist: "Arijit Singh" },
    { name: "Raataan Lambiyan", artist: "Tanishk Bagchi" },
    { name: "Mann Meri Jaan", artist: "King" },
    { name: "Apna Bana Le", artist: "Arijit Singh" },
    { name: "Pasoori", artist: "Ali Sethi" }
  ]
};

// Add curated songs to database with proper error handling and similar songs
export const addCuratedSongsToDatabase = async () => {
  const results = { added: 0, errors: 0, skipped: 0 };
  
  try {
    console.log('Starting to add curated songs to database...');
    
    // Check if Spotify API is available
    const canMakeApiCalls = await spotifyService.canMakeApiCalls();
    if (!canMakeApiCalls) {
      throw new Error('Cannot connect to Spotify API');
    }
    console.log('Spotify API connection verified');

    const addedSongIds: string[] = [];

    // Process English songs
    for (const song of curatedSongs.english) {
      try {
        // Check if song already exists
        const { data: existingSong } = await supabase
          .from('songs')
          .select('id')
          .eq('title', song.name)
          .eq('artist', song.artist)
          .maybeSingle();

        if (existingSong) {
          console.log(`Song already exists: ${song.name} by ${song.artist}`);
          results.skipped++;
          continue;
        }

        // Search for the song on Spotify
        const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);
        
        if (spotifyTrack) {
          // Get audio features to determine category
          const audioFeatures = await spotifyService.getAudioFeatures([spotifyTrack.id]);
          const categories = audioFeatures && audioFeatures[0] ? 
            getAudioFeatureCategories(audioFeatures[0]) : ['moderate'];

          // Generate unique ID
          const songId = `spotify-eng-${spotifyTrack.id}`;
          
          // Add to database
          const { error: insertError } = await supabase
            .from('songs')
            .insert({
              id: songId,
              title: spotifyTrack.name,
              artist: spotifyTrack.artists[0]?.name || song.artist,
              album: spotifyTrack.album?.name || 'Unknown Album',
              release_date: spotifyTrack.album?.release_date || '2023-01-01',
              language: 'English',
              category: categories[0],
              cover_image: spotifyTrack.album?.images?.[0]?.url || '/placeholder.svg',
              duration: `${Math.floor(spotifyTrack.duration_ms / 60000)}:${String(Math.floor((spotifyTrack.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
              spotify_url: spotifyTrack.external_urls?.spotify,
              tags: [categories[0], 'english', song.artist.toLowerCase().replace(/\s+/g, '-')],
              description: `${spotifyTrack.name} by ${song.artist} - A popular English track.`
            });

          if (!insertError) {
            console.log(`Added English song: ${song.name} by ${song.artist}`);
            results.added++;
            addedSongIds.push(songId);
          } else {
            console.error(`Error adding English song ${song.name}:`, insertError);
            results.errors++;
          }
        } else {
          console.warn(`Could not find ${song.name} by ${song.artist} on Spotify`);
          results.errors++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing English song ${song.name}:`, error);
        results.errors++;
      }
    }

    // Process Hindi songs
    for (const song of curatedSongs.hindi) {
      try {
        // Check if song already exists
        const { data: existingSong } = await supabase
          .from('songs')
          .select('id')
          .eq('title', song.name)
          .eq('artist', song.artist)
          .maybeSingle();

        if (existingSong) {
          console.log(`Song already exists: ${song.name} by ${song.artist}`);
          results.skipped++;
          continue;
        }

        // Search for the song on Spotify
        const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);
        
        if (spotifyTrack) {
          // Get audio features to determine category
          const audioFeatures = await spotifyService.getAudioFeatures([spotifyTrack.id]);
          const categories = audioFeatures && audioFeatures[0] ? 
            getAudioFeatureCategories(audioFeatures[0]) : ['moderate'];

          // Generate unique ID
          const songId = `spotify-hin-${spotifyTrack.id}`;
          
          // Add to database
          const { error: insertError } = await supabase
            .from('songs')
            .insert({
              id: songId,
              title: spotifyTrack.name,
              artist: spotifyTrack.artists[0]?.name || song.artist,
              album: spotifyTrack.album?.name || 'Unknown Album',
              release_date: spotifyTrack.album?.release_date || '2023-01-01',
              language: 'Hindi',
              category: categories[0],
              cover_image: spotifyTrack.album?.images?.[0]?.url || '/placeholder.svg',
              duration: `${Math.floor(spotifyTrack.duration_ms / 60000)}:${String(Math.floor((spotifyTrack.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
              spotify_url: spotifyTrack.external_urls?.spotify,
              tags: [categories[0], 'hindi', song.artist.toLowerCase().replace(/\s+/g, '-')],
              description: `${spotifyTrack.name} by ${song.artist} - A popular Hindi track.`
            });

          if (!insertError) {
            console.log(`Added Hindi song: ${song.name} by ${song.artist}`);
            results.added++;
            addedSongIds.push(songId);
          } else {
            console.error(`Error adding Hindi song ${song.name}:`, insertError);
            results.errors++;
          }
        } else {
          console.warn(`Could not find ${song.name} by ${song.artist} on Spotify`);
          results.errors++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing Hindi song ${song.name}:`, error);
        results.errors++;
      }
    }

    // Add song similarities for the newly added songs
    if (addedSongIds.length > 1) {
      console.log('Adding song similarities...');
      try {
        const similarities = [];
        
        // Create similarities between songs of the same language
        for (let i = 0; i < addedSongIds.length; i++) {
          for (let j = i + 1; j < addedSongIds.length; j++) {
            const songId1 = addedSongIds[i];
            const songId2 = addedSongIds[j];
            
            // Add bidirectional similarities
            similarities.push({
              id: `${songId1}-${songId2}`,
              song_id: songId1,
              similar_song_id: songId2
            });
            similarities.push({
              id: `${songId2}-${songId1}`,
              song_id: songId2,
              similar_song_id: songId1
            });
          }
        }

        if (similarities.length > 0) {
          const { error: similarityError } = await supabase
            .from('song_similarities')
            .insert(similarities);

          if (similarityError) {
            console.error('Error adding song similarities:', similarityError);
          } else {
            console.log(`Added ${similarities.length} song similarities`);
          }
        }
      } catch (error) {
        console.error('Error creating song similarities:', error);
      }
    }

    console.log('Finished adding curated songs:', results);
    return results;
  } catch (error) {
    console.error('Error adding curated songs:', error);
    throw error;
  }
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
              release_date: '2023-01-01',
              language: 'English',
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
  enrichExistingSongs: async () => ({ updated: 0, newSongs: 0, errors: 0 }),
  updateAllCategories: async () => ({}),
  discoverSongsForCategory: async () => ({ updated: 0, newSongs: 0, errors: 0 }),
  addCuratedSongsToDatabase
};
