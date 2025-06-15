
import { supabase } from '@/integrations/supabase/client';
import { getSongDbDataFromSpotifyTrack } from '@/utils/curatedSongHelpers';

export async function upsertSongsToDb(curatedWithSpotify: any[]) {
  const results = { added: 0, updated: 0, errors: 0, skipped: 0 };
  const processedSongIds: string[] = [];

  for (const { spotifyTrack, ...song } of curatedWithSpotify) {
    const { dbSong, lookupTitle, lookupArtist } = getSongDbDataFromSpotifyTrack(song, spotifyTrack);

    // Check if this song already exists (by title+artist)
    const { data: existingSong } = await supabase
      .from('songs')
      .select('id')
      .eq('title', lookupTitle)
      .eq('artist', lookupArtist)
      .maybeSingle();

    let songId: string;
    if (existingSong && existingSong.id) {
      songId = existingSong.id;
      // Update all fields
      const { error: updateError } = await supabase
        .from('songs')
        .update({ ...dbSong, updated_at: new Date().toISOString() })
        .eq('id', songId);
      if (!updateError) results.updated++;
      else results.errors++;
    } else {
      songId = `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { error: insertError } = await supabase
        .from('songs')
        .insert({ ...dbSong, id: songId });
      if (!insertError) results.added++;
      else results.errors++;
    }
    processedSongIds.push(songId);
  }

  // Create song_similarities relationships (as before)
  if (processedSongIds.length > 1) {
    const similarities: any[] = [];
    for (let i = 0; i < processedSongIds.length; i++) {
      for (let j = i + 1; j < processedSongIds.length; j++) {
        const songId1 = processedSongIds[i], songId2 = processedSongIds[j];
        similarities.push({
          id: `${songId1}-${songId2}`,
          song_id: songId1,
          similar_song_id: songId2
        }, {
          id: `${songId2}-${songId1}`,
          song_id: songId2,
          similar_song_id: songId1
        });
      }
    }
    await supabase.from('song_similarities').upsert(similarities, { onConflict: 'id' });
  }

  return results;
}
