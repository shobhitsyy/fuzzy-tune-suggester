
import { supabase } from "@/integrations/supabase/client";

/**
 * Completely clears and repopulates the song_similarities table so that every song has 3 similar songs
 * of the SAME CATEGORY (if enough possible). Adds both (A,B) and (B,A) directions.
 * No fallback to other categories, strict match only.
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

  // 3. For each song, pick 3 other songs of same category
  let bulkSimilarities: any[] = [];
  for (const song of allSongs) {
    const sameCategory = allSongs.filter(s => s.id !== song.id && s.category === song.category);
    // Shuffle
    for (let i = sameCategory.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sameCategory[i], sameCategory[j]] = [sameCategory[j], sameCategory[i]];
    }
    const picks = sameCategory.slice(0, 3);

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

