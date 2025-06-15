
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures every song in the DB has at least 3 similar songs in the song_similarities table.
 * This is now a utility function, not a component.
 */
export async function ensureSimilarSongsForAll() {
  // Get all songs
  const { data: allSongs, error: fetchSongsError } = await supabase
    .from("songs")
    .select("id,category,language");
  if (fetchSongsError || !allSongs) {
    throw new Error("Failed to fetch songs: " + fetchSongsError?.message);
  }
  let changedCount = 0;
  for (const song of allSongs) {
    const { data: existingSim, error: fetchSimErr } = await supabase
      .from("song_similarities")
      .select("similar_song_id")
      .eq("song_id", song.id);

    if (fetchSimErr) continue;
    if ((existingSim?.length || 0) >= 3) continue;

    // Need to add up to 3 similar songs, picked randomly from suitable candidates (category/language, else any)
    const candidateSongs = allSongs.filter(
      (s) => s.id !== song.id && s.category === song.category && s.language === song.language
    );
    let finalCandidates = candidateSongs;
    if (candidateSongs.length < 3) {
      finalCandidates = allSongs.filter((s) => s.id !== song.id);
    }
    // Shuffle
    for (let i = finalCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalCandidates[i], finalCandidates[j]] = [finalCandidates[j], finalCandidates[i]];
    }
    const needed = 3 - (existingSim?.length || 0);
    const alreadySimIds = existingSim?.map((sim: any) => sim.similar_song_id) ?? [];
    const addThese = finalCandidates
      .filter((s) => !alreadySimIds.includes(s.id))
      .slice(0, needed);

    // Insert new similarities (both directions)
    for (const simSong of addThese) {
      const pairs = [
        { song_id: song.id, similar_song_id: simSong.id, id: `${song.id}-${simSong.id}` },
        { song_id: simSong.id, similar_song_id: song.id, id: `${simSong.id}-${song.id}` },
      ];
      await supabase.from("song_similarities").upsert(pairs, { onConflict: "id" });
    }
    if (addThese.length > 0) changedCount++;
  }
  return changedCount;
}
