import { supabase } from '@/integrations/supabase/client';
import { getSongDbDataFromSpotifyTrack } from '@/utils/curatedSongHelpers';

/**
 * Helper function to generate the next sequential id for song insertion.
 * Format: [langCode]-[category]-[n], e.g. en-upbeat-63 or hi-calm-82
 */
async function generateNextSongId(language: string, category: string): Promise<string> {
  const langCode = (language.toLowerCase() === 'hindi') ? 'hi' : 'en';
  const catCode = category.toLowerCase();
  // Fetch all ids for this lang/category with this pattern
  const pattern = `${langCode}-${catCode}-%`;
  const { data, error } = await supabase
    .from('songs')
    .select('id')
    .like('id', pattern);

  if (error) {
    console.error('Error fetching existing ids for id-generation:', error);
    // fallback to random id if error
    return `${langCode}-${catCode}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  // Find the highest existing number used for this (lang, cat)
  let maxNum = 0;
  (data || []).forEach(row => {
    const match = row.id.match(new RegExp(`^${langCode}-${catCode}-(\\d+)$`, 'i'));
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1]));
    }
  });
  return `${langCode}-${catCode}-${maxNum + 1}`;
}

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
      // Generate new id [langCode]-[category]-[n]
      songId = await generateNextSongId(dbSong.language, dbSong.category);
      const { error: insertError } = await supabase
        .from('songs')
        .insert({ ...dbSong, id: songId });
      if (!insertError) results.added++;
      else results.errors++;
    }
    processedSongIds.push(songId);
  }

  // Remove song_similarities upsert, as table no longer exists.

  return results;
}
