
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
  if (hasPopulated) return { added: 0, errors: 0, skipped: 0 };
  hasPopulated = true;

  const results = { added: 0, errors: 0, skipped: 0 };
  const addedSongIds: string[] = [];

  // Compose merged song list with language property
  const allSongs = [
    ...curatedSongs.english.map(song => ({ ...song, language: 'English' })),
    ...curatedSongs.hindi.map(song => ({ ...song, language: 'Hindi' }))
  ];

  for (const song of allSongs) {
    try {
      // Check if song already exists in Supabase by name+artist
      const { data: existingSong } = await supabase
        .from('songs')
        .select('id')
        .eq('title', song.name)
        .eq('artist', song.artist)
        .maybeSingle();

      if (existingSong) {
        results.skipped++;
        continue;
      }

      // Find track on Spotify for accurate URLs/metadata
      const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);

      if (!spotifyTrack) {
        results.errors++;
        continue;
      }

      const songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const categories = [song.category];
      const durationMs = spotifyTrack.duration_ms || 0;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Insert new song with full metadata
      const { error: insertError } = await supabase
        .from('songs')
        .insert({
          id: songId,
          title: spotifyTrack.name,
          artist: spotifyTrack.artists[0]?.name || song.artist,
          album: spotifyTrack.album?.name || 'Unknown Album',
          release_date: spotifyTrack.album?.release_date || '2023-01-01',
          language: song.language,
          category: song.category,
          cover_image: (spotifyTrack.album?.images?.[0]?.url) || '/placeholder.svg',
          duration,
          spotify_url: spotifyTrack.external_urls?.spotify,
          tags: categories,
          description: `${song.name} by ${song.artist}`
        });

      if (!insertError) {
        results.added++;
        addedSongIds.push(songId);
      } else {
        results.errors++;
      }
    } catch (error) {
      results.errors++;
    }
  }

  // Create pairwise similarities only for new ingested songs
  if (addedSongIds.length > 1) {
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
      await supabase.from('song_similarities').insert(similarities);
    }
  }
  return results;
};

export const spotifyDatabaseService = {
  addCuratedSongsToDatabase,
};
