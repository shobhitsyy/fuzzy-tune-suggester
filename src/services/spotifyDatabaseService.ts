
import { spotifyService } from './spotifyService';
import { supabase } from '@/integrations/supabase/client';
import { SongCategoryType } from '@/utils/fuzzyLogic';

// Add 5 English and 5 Hindi curated songs, looking up Spotify for URLs and images
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

let hasPopulated = false;

export const addCuratedSongsToDatabase = async () => {
  if (hasPopulated) {
    console.log('Songs already populated, skipping...');
    return { added: 0, errors: 0, skipped: 0 };
  }
  
  console.log('Starting to populate curated songs...');
  
  // First, test Spotify API connection
  try {
    const canMakeApiCalls = await spotifyService.canMakeApiCalls();
    if (!canMakeApiCalls) {
      throw new Error('Cannot connect to Spotify API');
    }
    console.log('✅ Spotify API connection verified');
  } catch (error) {
    console.error('❌ Spotify API connection failed:', error);
    throw new Error('Failed to connect to Spotify API. Please check your credentials.');
  }
  
  const results = { added: 0, errors: 0, skipped: 0 };
  const addedSongIds: string[] = [];

  // Compose merged song list with language property
  const allSongs = [
    ...curatedSongs.english.map(song => ({ ...song, language: 'English' })),
    ...curatedSongs.hindi.map(song => ({ ...song, language: 'Hindi' }))
  ];

  console.log(`Processing ${allSongs.length} curated songs...`);

  for (const song of allSongs) {
    try {
      console.log(`🎵 Processing song: ${song.name} by ${song.artist}`);
      
      // Check if song already exists in Supabase by name+artist
      const { data: existingSong } = await supabase
        .from('songs')
        .select('id')
        .eq('title', song.name)
        .eq('artist', song.artist)
        .maybeSingle();

      if (existingSong) {
        console.log(`⏭️ Song ${song.name} already exists, skipping...`);
        results.skipped++;
        continue;
      }

      // Find track on Spotify for accurate URLs/metadata
      console.log(`🔍 Searching Spotify for: ${song.name} by ${song.artist}`);
      const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);

      const songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      if (!spotifyTrack) {
        console.log(`⚠️ Could not find ${song.name} on Spotify, adding with default data`);
        
        // Add song with default data if Spotify lookup fails
        const duration = '3:00'; // Default duration
        const releaseDate = '2023-01-01'; // Default release date

        const { error: insertError } = await supabase
          .from('songs')
          .insert({
            id: songId,
            title: song.name,
            artist: song.artist,
            album: 'Unknown Album',
            release_date: releaseDate,
            language: song.language,
            category: song.category,
            cover_image: '/placeholder.svg',
            duration,
            spotify_url: null,
            tags: [song.category],
            description: `${song.name} by ${song.artist}`
          });

        if (!insertError) {
          console.log(`✅ Successfully added: ${song.name} with default data`);
          results.added++;
          addedSongIds.push(songId);
        } else {
          console.error(`❌ Error inserting ${song.name} with default data:`, insertError);
          results.errors++;
        }
        continue;
      }

      console.log(`✅ Found on Spotify: ${spotifyTrack.name} by ${spotifyTrack.artists[0]?.name}`);

      const categories = [song.category];
      const durationMs = spotifyTrack.duration_ms || 180000; // Default 3 minutes if not available
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Get album release date from Spotify, fallback to a default
      const releaseDate = spotifyTrack.album?.release_date || '2023-01-01';

      console.log(`💾 Inserting song: ${spotifyTrack.name} with Spotify data`);
      console.log(`📅 Category: ${song.category}, Release Date: ${releaseDate}`);

      // Insert new song with full metadata
      const { error: insertError } = await supabase
        .from('songs')
        .insert({
          id: songId,
          title: spotifyTrack.name,
          artist: spotifyTrack.artists[0]?.name || song.artist,
          album: spotifyTrack.album?.name || 'Unknown Album',
          release_date: releaseDate,
          language: song.language,
          category: song.category,
          cover_image: (spotifyTrack.album?.images?.[0]?.url) || '/placeholder.svg',
          duration,
          spotify_url: spotifyTrack.external_urls?.spotify,
          tags: categories,
          description: `${song.name} by ${song.artist}`
        });

      if (!insertError) {
        console.log(`✅ Successfully added: ${spotifyTrack.name}`);
        results.added++;
        addedSongIds.push(songId);
      } else {
        console.error(`❌ Error inserting ${song.name}:`, insertError);
        console.error('Full error details:', JSON.stringify(insertError, null, 2));
        results.errors++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${song.name}:`, error);
      results.errors++;
    }
  }

  // Create pairwise similarities only for new ingested songs
  if (addedSongIds.length > 1) {
    console.log(`🔗 Creating similarities for ${addedSongIds.length} songs`);
    const similarities: Array<{ id: string; song_id: string; similar_song_id: string }> = [];
    for (let i = 0; i < addedSongIds.length; i++) {
      for (let j = i + 1; j < addedSongIds.length; j++) {
        const songId1 = addedSongIds[i], songId2 = addedSongIds[j];
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
      const { error: simError } = await supabase.from('song_similarities').insert(similarities);
      if (simError) {
        console.error('❌ Error creating similarities:', simError);
      } else {
        console.log(`✅ Created ${similarities.length} similarity relationships`);
      }
    }
  }

  // Mark as populated only if we actually added songs
  if (results.added > 0) {
    hasPopulated = true;
  }

  console.log('🎉 Curated songs population complete:', results);
  return results;
};

// Add placeholder methods to prevent build errors
export const enrichExistingSongs = async (batchSize: number = 20) => {
  return { updated: 0, newSongs: 0, errors: 0 };
};

export const updateAllCategories = async () => {
  return {
    energetic: { updated: 0, newSongs: 0, errors: 0 },
    upbeat: { updated: 0, newSongs: 0, errors: 0 },
    moderate: { updated: 0, newSongs: 0, errors: 0 },
    relaxed: { updated: 0, newSongs: 0, errors: 0 },
    calm: { updated: 0, newSongs: 0, errors: 0 }
  };
};

export const spotifyDatabaseService = {
  addCuratedSongsToDatabase,
  enrichExistingSongs,
  updateAllCategories,
};
