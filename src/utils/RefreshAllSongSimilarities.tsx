
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to refresh the song_similarities table so every song has exactly 3 "similar songs".
 * - Removes all previous entries for a song before inserting new ones.
 * - Prefers matching category/language, or falls back to any other song.
 * - Inserts both directional relationships: (A,B) and (B,A).
 */
export async function refreshAllSongSimilarities() {
  // Fetch all songs
  const { data: allSongs, error: fetchSongsError } = await supabase
    .from("songs")
    .select("id,category,language");
  if (fetchSongsError || !allSongs) {
    throw new Error("Failed to fetch songs: " + fetchSongsError?.message);
  }

  let updatedCount = 0;
  for (const song of allSongs) {
    // Remove old similarities for this song (both directions for cleanliness)
    await supabase
      .from("song_similarities")
      .delete()
      .or(`song_id.eq.${song.id},similar_song_id.eq.${song.id}`);

    // Pick up to 3 other songs to be similar
    const candidateSameCatLang = allSongs.filter(
      (s) =>
        s.id !== song.id &&
        s.category === song.category &&
        s.language === song.language
    );
    let finalCandidates = candidateSameCatLang;
    if (finalCandidates.length < 3) {
      finalCandidates = allSongs.filter((s) => s.id !== song.id);
    }
    // Shuffle
    for (let i = finalCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalCandidates[i], finalCandidates[j]] = [finalCandidates[j], finalCandidates[i]];
    }
    const pick = finalCandidates.slice(0, 3);

    // Insert new similarities (both directions, unique id per pair)
    const similarities = [];
    for (const simSong of pick) {
      similarities.push(
        { id: `${song.id}-${simSong.id}`, song_id: song.id, similar_song_id: simSong.id },
        { id: `${simSong.id}-${song.id}`, song_id: simSong.id, similar_song_id: song.id }
      );
    }
    if (similarities.length > 0) {
      await supabase.from("song_similarities").upsert(similarities, { onConflict: "id" });
      updatedCount++;
    }
  }
  console.log(`Refreshed similarities for ${updatedCount} songs.`);
  return updatedCount;
}
