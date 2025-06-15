
import { supabase } from "@/integrations/supabase/client";

// Returns playlist id for user, creating default 'My Playlist' if needed
export async function getOrCreateDefaultPlaylist(userId: string) {
  const { data, error } = await supabase
    .from("playlists")
    .select("id")
    .eq("user_id", userId)
    .eq("name", "My Playlist")
    .maybeSingle();
  if (error) throw error;

  if (data?.id) {
    return data.id;
  }

  // Create if missing
  const { data: inserted, error: insertError } = await supabase
    .from("playlists")
    .insert([
      { user_id: userId, name: "My Playlist" }
    ])
    .select()
    .maybeSingle();
  if (insertError) throw insertError;

  return inserted?.id;
}

// Add song to user's default playlist
export async function addSongToDefaultPlaylist(userId: string, songId: string) {
  const playlistId = await getOrCreateDefaultPlaylist(userId);
  const { data, error } = await supabase
    .from("playlist_songs")
    .insert([{ playlist_id: playlistId, song_id: songId }]);
  if (error && !error.message.includes('duplicate')) throw error;
  return data;
}
