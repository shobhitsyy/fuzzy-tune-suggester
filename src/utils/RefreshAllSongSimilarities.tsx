
import { supabase } from "@/integrations/supabase/client";

/**
 * Clears and repopulates the song_similarities table so every song has 3 similar songs.
 * Prefers same category, but fills up remaining with other categories if needed.
 * Both (A,B) and (B,A) are added for bidirectional relationships.
 */
export async function refreshAllSongSimilarities() {
  // 1. Clear the song_similarities table (truncate all records)
  const { error: deleteError } = await supabase
    .from("song_similarities")
    .delete()
    .neq("id", ""); // delete all where id != ''

  if (deleteError) {
    throw new Error("Failed to clear song_similarities: " + deleteError.message);
  }

  // 2. Fetch all songs
  const { data: allSongs, error: fetchSongsError } = await supabase
    .from("songs")
    .select("id,category");
  if (fetchSongsError || !allSongs) {
    throw new Error("Failed to fetch songs: " + fetchSongsError?.message);
  }

  let bulkSimilarities: any[] = [];
  for (const song of allSongs) {
    // Songs of the same category, but not self
    const sameCategory = allSongs.filter(s => s.id !== song.id && s.category === song.category);
    // Shuffle
    for (let i = sameCategory.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sameCategory[i], sameCategory[j]] = [sameCategory[j], sameCategory[i]];
    }
    // Pick as many as possible from same category (up to 3)
    let picks = sameCategory.slice(0, 3);

    // If not enough, pick the rest from other categories, avoiding duplicates and self
    if (picks.length < 3) {
      // Make a flat list of "other-category" songs, still avoiding self & already picked
      const alreadyPickedIds = new Set([song.id, ...picks.map(p => p.id)]);
      const otherCategory = allSongs
        .filter(s => !alreadyPickedIds.has(s.id));
      // Shuffle others
      for (let i = otherCategory.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherCategory[i], otherCategory[j]] = [otherCategory[j], otherCategory[i]];
      }
      picks = picks.concat(otherCategory.slice(0, 3 - picks.length));
    }

    // Insert up to 3 similarities (if possible)
    for (const sim of picks) {
      bulkSimilarities.push(
        { id: `${song.id}-${sim.id}`, song_id: song.id, similar_song_id: sim.id },
        { id: `${sim.id}-${song.id}`, song_id: sim.id, similar_song_id: song.id }
      );
    }
  }

  // 4. Insert new similarities in bulk
  if (bulkSimilarities.length > 0) {
    const { error: insertError } = await supabase
      .from("song_similarities")
      .upsert(bulkSimilarities, { onConflict: "id" });
    if (insertError) {
      throw new Error("Failed to insert song_similarities: " + insertError.message);
    }
  }
  console.log(`Rebuilt similarities for ${allSongs.length} songs, total pairs: ${bulkSimilarities.length}`);
  return allSongs.length;
}

