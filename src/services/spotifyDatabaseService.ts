
import { spotifyService } from './spotifyService';
import { supabase } from '@/integrations/supabase/client';
import { SongCategoryType } from '@/utils/fuzzyLogic';

// Define the Spotify track type properly
interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    release_date: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

// Curated songs with proper categories
const curatedSongs = {
  english: [
    { name: 'Blinding Lights', artist: 'The Weeknd', category: 'energetic' as SongCategoryType },
    { name: 'Watermelon Sugar', artist: 'Harry Styles', category: 'upbeat' as SongCategoryType },
    { name: 'Levitating', artist: 'Dua Lipa', category: 'energetic' as SongCategoryType },
    { name: 'Good 4 U', artist: 'Olivia Rodrigo', category: 'upbeat' as SongCategoryType },
    { name: 'Stay', artist: 'The Kid LAROI', category: 'moderate' as SongCategoryType }
  ],
  hindi: [
    { name: 'Kesariya', artist: 'Arijit Singh', category: 'relaxed' as SongCategoryType },
    { name: 'Raataan Lambiyan', artist: 'Tanishk Bagchi', category: 'calm' as SongCategoryType },
    { name: 'Mann Meri Jaan', artist: 'King', category: 'upbeat' as SongCategoryType },
    { name: 'Apna Bana Le', artist: 'Arijit Singh', category: 'relaxed' as SongCategoryType },
    { name: 'Baarish Ban Jaana', artist: 'Stebin Ben', category: 'calm' as SongCategoryType }
  ]
};

// Add curated songs to database with proper error handling and similar songs
export const addCuratedSongsToDatabase = async () => {
  const results = { added: 0, errors: 0, skipped: 0 };
  
  try {
    console.log('Starting to add curated songs to database...');
    
    // Check Spotify connection
    const isConnected = await spotifyService.isConnected();
    if (!isConnected) {
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

        // Search for song on Spotify
        const searchResults = await spotifyService.searchTracks(`${song.name} ${song.artist}`, 1);
        
        if (searchResults.tracks.items.length > 0) {
          const spotifyTrack = searchResults.tracks.items[0] as SpotifyTrack;
          const songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const categories = [song.category];
          
          const durationMs = spotifyTrack.duration_ms;
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);
          const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Insert song
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
              duration: duration,
              spotify_url: spotifyTrack.external_urls?.spotify,
              tags: categories,
              description: `${song.name} by ${song.artist}`
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
          console.log(`No Spotify results found for: ${song.name} by ${song.artist}`);
          results.errors++;
        }
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

        // Search for song on Spotify
        const searchResults = await spotifyService.searchTracks(`${song.name} ${song.artist}`, 1);
        
        if (searchResults.tracks.items.length > 0) {
          const spotifyTrack = searchResults.tracks.items[0] as SpotifyTrack;
          const songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const categories = [song.category];
          
          const durationMs = spotifyTrack.duration_ms;
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);
          const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Insert song
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
              duration: duration,
              spotify_url: spotifyTrack.external_urls?.spotify,
              tags: categories,
              description: `${song.name} by ${song.artist}`
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
          console.log(`No Spotify results found for: ${song.name} by ${song.artist}`);
          results.errors++;
        }
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

    console.log('Curated songs addition completed:', results);
    return results;
  } catch (error) {
    console.error('Error in addCuratedSongsToDatabase:', error);
    throw error;
  }
};

// Simplified service exports to fix build errors
export const spotifyDatabaseService = {
  addCuratedSongsToDatabase
};
