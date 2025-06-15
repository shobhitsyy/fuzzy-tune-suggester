
// Fetch and Enrich Songs Edge Function
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const spotifyClientId = Deno.env.get("SPOTIFY_CLIENT_ID");
const spotifyClientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

if (!supabaseUrl || !supabaseKey || !spotifyClientId || !spotifyClientSecret || !geminiApiKey) {
  throw new Error("Missing required supabase or API secrets.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSpotifyAccessToken() {
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${spotifyClientId}:${spotifyClientSecret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials"
  });

  if (!tokenRes.ok) {
    throw new Error("Failed to fetch Spotify access token: " + (await tokenRes.text()));
  }
  const { access_token } = await tokenRes.json();
  return access_token;
}

async function fetchSpotifyTracks(accessToken: string, options: { limit?: number; market?: string; q?: string } = {}) {
  // Default: search top "pop" tracks globally (can adjust as needed)
  const q = options.q ?? "pop";
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=${options.limit ?? 10}` +
    (options.market ? `&market=${options.market}` : "");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Spotify tracks: " + (await res.text()));
  const data = await res.json();
  return (data.tracks?.items ?? []);
}

async function generateCatchyDescriptionGemini(track: any) {
  // Compose a rich prompt
  const prompt = `Write a catchy, creative, but concise (max 25 words) description for the song "${track.name}" by ${track.artists[0]?.name}, from the album "${track.album.name}". Mention its vibe, mood, or what makes it stand out. Do not just restate the title or artist.`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    console.error("Gemini API failed:", await resp.text());
    // Fallback: basic description
    return `${track.name} by ${track.artists[0]?.name} - a vibrant hit.`;
  }
  const result = await resp.json();
  const desc = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return desc.trim() || `${track.name} by ${track.artists[0]?.name} - a vibrant track.`;
}

async function upsertSong(song: any) {
  // Prevent duplicates by title, artist, language:
  const { data: existingSong, error: lookupErr } = await supabase
    .from("songs")
    .select("id")
    .eq("title", song.title)
    .eq("artist", song.artist)
    .eq("language", song.language)
    .maybeSingle();

  if (lookupErr) {
    console.error("Song lookup error:", lookupErr);
    return { error: lookupErr };
  }
  song.updated_at = new Date().toISOString();
  song.tags = song.tags ?? [song.category];

  if (existingSong && existingSong.id) {
    // Update only (preserve created_at)
    const { error } = await supabase
      .from("songs")
      .update(song)
      .eq("id", existingSong.id);
    if (error) {
      console.error("Update failed for song:", song.title, error);
    }
    return { updated: true, id: existingSong.id };
  } else {
    // Insert
    song.id = `${song.language.substring(0,2).toLowerCase()}-${song.category.toLowerCase()}-${Date.now()}`;
    song.created_at = new Date().toISOString();

    const { error } = await supabase
      .from("songs")
      .insert(song);
    if (error) {
      console.error("Insert failed for song:", song.title, error);
    }
    return { inserted: true, id: song.id };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // (Optionally) accept options from JSON body, e.g., { limit: 10, market: "IN", q: "pop" }
    const { q, limit, market } = (await req.json().catch(() => ({}))) || {};

    const accessToken = await getSpotifyAccessToken();
    const tracks = await fetchSpotifyTracks(accessToken, { q, limit, market });

    const results: any[] = [];
    for (const track of tracks) {
      // Compose song object
      const language = (market?.toUpperCase() === "IN") ? "Hindi" : "English";
      const songObj = {
        title: track.name,
        artist: track.artists[0]?.name || "Unknown Artist",
        album: track.album?.name || "Unknown Album",
        release_date: track.album?.release_date || "2023-01-01",
        language,
        category: "moderate", // Default; could use track features/predictions
        cover_image: track.album?.images?.[0]?.url ?? null,
        duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000)/1000)).padStart(2, "0")}`,
        spotify_url: track.external_urls?.spotify || null,
        tags: ["moderate"],
        description: "",
      };

      // Get catchy description from Gemini
      songObj.description = await generateCatchyDescriptionGemini(track);

      // Upsert (insert/update) into Supabase
      const upsertRes = await upsertSong(songObj);
      results.push({ ...upsertRes, title: songObj.title });
    }

    return new Response(JSON.stringify({
      status: "success",
      message: `Processed ${results.length} songs.`,
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
