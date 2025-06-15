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
  // Instead of skipping, always (upsert) update with accurate data
  console.log('Starting Spotify data refresh for 10 curated songs...');

  // Test Spotify API connection
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

  const results = { added: 0, updated: 0, errors: 0, skipped: 0 };
  const processedSongIds: string[] = [];

  // Only 10 songs: 5 English, 5 Hindi
  const allSongs = [
    ...curatedSongs.english.map(song => ({ ...song, language: 'English' })),
    ...curatedSongs.hindi.map(song => ({ ...song, language: 'Hindi' }))
  ].slice(0, 10);

  for (const song of allSongs) {
    try {
      console.log(`🎵 Processing: ${song.name} by ${song.artist}`);

      // Fetch from Spotify for latest details
      console.log(`🔍 Searching Spotify for: ${song.name} by ${song.artist}`);
      const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);

      // If not found on Spotify, skip (do not update incomplete data)
      if (!spotifyTrack) {
        console.warn(`⚠️ Song not found on Spotify: ${song.name} by ${song.artist}, skipping update.`);
        results.skipped++;
        continue;
      }

      const minutes = Math.floor((spotifyTrack.duration_ms || 180000) / 60000);
      const seconds = Math.floor(((spotifyTrack.duration_ms || 180000) % 60000) / 1000);
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      const album = spotifyTrack.album?.name || 'Unknown Album';
      const releaseDate = (spotifyTrack.album as any)?.release_date || '2023-01-01';
      const artist = spotifyTrack.artists?.[0]?.name || song.artist;
      const coverImage = spotifyTrack.album?.images?.[0]?.url || '/placeholder.svg';
      const spotifyUrl = spotifyTrack.external_urls?.spotify || null;

      // Check if this song already exists (by title+artist)
      const { data: existingSong, error: fetchError } = await supabase
        .from('songs')
        .select('id')
        .eq('title', spotifyTrack.name)
        .eq('artist', artist)
        .maybeSingle();

      let songId: string;
      if (existingSong && existingSong.id) {
        songId = existingSong.id;
        // Update all fields with the latest info
        const { error: updateError } = await supabase
          .from('songs')
          .update({
            title: spotifyTrack.name,
            artist,
            album,
            release_date: releaseDate,
            language: song.language,
            category: song.category,
            cover_image: coverImage,
            duration,
            spotify_url: spotifyUrl,
            tags: [song.category],
            description: `${spotifyTrack.name} by ${artist}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', songId);
        if (!updateError) {
          console.log(`🔄 Updated: ${spotifyTrack.name} by ${artist}`);
          results.updated++;
        } else {
          console.error(`❌ Failed to update: ${spotifyTrack.name}`, updateError);
          results.errors++;
        }
      } else {
        songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Insert new song
        const { error: insertError } = await supabase
          .from('songs')
          .insert({
            id: songId,
            title: spotifyTrack.name,
            artist,
            album,
            release_date: releaseDate,
            language: song.language,
            category: song.category,
            cover_image: coverImage,
            duration,
            spotify_url: spotifyUrl,
            tags: [song.category],
            description: `${spotifyTrack.name} by ${artist}`
          });

        if (!insertError) {
          console.log(`✅ Added: ${spotifyTrack.name} by ${artist}`);
          results.added++;
        } else {
          console.error(`❌ Failed to add: ${spotifyTrack.name}`, insertError);
          results.errors++;
        }
      }
      processedSongIds.push(songId);

    } catch (error) {
      console.error(`❌ Error processing ${song.name}:`, error);
      results.errors++;
    }
  }

  // Update song_similarities for the upserted songs
  if (processedSongIds.length > 1) {
    const similarities = [];
    for (let i = 0; i < processedSongIds.length; i++) {
      for (let j = i + 1; j < processedSongIds.length; j++) {
        const songId1 = processedSongIds[i], songId2 = processedSongIds[j];
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
      // If some already exist, ignore errors
      await supabase.from('song_similarities').upsert(similarities, { onConflict: 'id' });
    }
  }

  console.log('🎉 Song update complete:', results);
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
