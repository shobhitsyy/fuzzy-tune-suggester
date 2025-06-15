
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to loop through every song and ensure each has at least 3 similar songs in song_similarities table.
 * This component is dev-facing: Place it anywhere for maintenance, then remove when done.
 */
const FixSimilarSongs: React.FC = () => {
  const [status, setStatus] = useState<string>("Idle");

  const fixSimilarities = async () => {
    setStatus("Fixing similarities...");
    // Get all songs
    const { data: allSongs, error: fetchSongsError } = await supabase.from("songs").select("id,category,language");
    if (fetchSongsError || !allSongs) {
      setStatus("Fetch error: " + fetchSongsError?.message);
      return;
    }
    let changedCount = 0;
    // For each song, check number of similar_song entries
    for (const song of allSongs) {
      const { data: existingSim, error: fetchSimErr } = await supabase
        .from("song_similarities")
        .select("id")
        .eq("song_id", song.id);

      if (fetchSimErr) {
        setStatus(`Error reading song_similarities for ${song.id}: ` + fetchSimErr.message);
        return;
      }
      if ((existingSim?.length || 0) >= 3) continue;

      // Need to add up to 3 similar songs (Simple: random from same category/language, skip self)
      const candidateSongs = allSongs.filter(
        (s) => s.id !== song.id && s.category === song.category && s.language === song.language
      );
      // If not enough in category/language, pick any 3 others except self
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
      // Get ids of already-similar songs to avoid dupes
      const alreadySimIds = existingSim?.map((sim: any) => sim.id.split('-').pop()) ?? [];
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
    setStatus(
      changedCount === 0
        ? "All songs have 3 or more similar entries!"
        : `Added/upserted similarities for ${changedCount} song(s).`
    );
  };

  return (
    <div className="mt-8 mb-4 p-2 border rounded bg-gray-50">
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white font-semibold"
        onClick={fixSimilarities}
      >
        Ensure all songs have 3 similar songs
      </button>
      <div className="mt-2 text-sm">{status}</div>
    </div>
  );
};

export default FixSimilarSongs;
