
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

/**
 * Generate similarities for a single song
 */
async function generateSimilaritiesForSong(songId: string, category: string, language: string) {
  // Get all other songs, preferring same category and language
  const { data: allSongs, error } = await supabase
    .from('songs')
    .select('id, category, language')
    .neq('id', songId);

  if (error || !allSongs) {
    console.error('Error fetching songs for similarities:', error);
    return;
  }

  // Priority: same category and language > same category > same language > any
  const sameCategory = allSongs.filter(s => s.category === category && s.language === language);
  const sameCategoryOtherLang = allSongs.filter(s => s.category === category && s.language !== language);
  const sameLangOtherCategory = allSongs.filter(s => s.language === language && s.category !== category);
  const others = allSongs.filter(s => s.category !== category && s.language !== language);

  // Shuffle each group
  [sameCategory, sameCategoryOtherLang, sameLangOtherCategory, others].forEach(group => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  });

  // Pick up to 3 songs, preferring higher priority groups
  const picks = [];
  const candidates = [...sameCategory, ...sameCategoryOtherLang, ...sameLangOtherCategory, ...others];
  
  for (let i = 0; i < Math.min(3, candidates.length); i++) {
    picks.push(candidates[i]);
  }

  // Insert bidirectional similarities
  if (picks.length > 0) {
    const similarities = [];
    for (const pick of picks) {
      similarities.push(
        { id: `${songId}-${pick.id}`, song_id: songId, similar_song_id: pick.id },
        { id: `${pick.id}-${songId}`, song_id: pick.id, similar_song_id: songId }
      );
    }

    await supabase
      .from('song_similarities')
      .upsert(similarities, { onConflict: 'id' });
    
    console.log(`Generated ${picks.length} similarities for song ${songId}`);
  }
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
      if (!insertError) {
        results.added++;
        // Generate similarities for newly added song
        await generateSimilaritiesForSong(songId, dbSong.category, dbSong.language);
      } else {
        results.errors++;
      }
    }
    processedSongIds.push(songId);
  }

  // For batch inserts, also create similarities between songs in the same batch
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
