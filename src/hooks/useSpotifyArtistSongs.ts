
import { useEffect, useState } from "react";

// You should use your Spotify API token here for production
const SPOTIFY_TOKEN = ""; // Use actual token in deployment, see docs for auth

interface SpotifyTrack {
  id: string;
  title: string;
  album: string;
  cover: string;
}

const useSpotifyArtistSongs = (artist: string, ignoreSongId?: string) => {
  const [artistSongs, setArtistSongs] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!artist) return;
    setLoading(true);
    const fetchSongs = async () => {
      try {
        // 1. Get artist ID
        const artistRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist&limit=1`,
          { headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` } }
        );
        const artistData = await artistRes.json();
        const artistId = artistData.artists?.items?.[0]?.id;
        if (!artistId) {
          setArtistSongs([]);
          setLoading(false);
          return;
        }
        // 2. Get top tracks by artist
        const topRes = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=IN`,
          { headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` } }
        );
        const topData = await topRes.json();
        const tracks = (topData.tracks || []).slice(0, 5)
          .filter((track: any) => !ignoreSongId || track.id !== ignoreSongId)
          .map((track: any) => ({
            id: track.id,
            title: track.name,
            album: track.album?.name ?? "",
            cover: track.album?.images?.[0]?.url ?? "/placeholder.svg"
          }));
        setArtistSongs(tracks.slice(0, 3)); // top 3
      } catch {
        setArtistSongs([]);
      }
      setLoading(false);
    };
    fetchSongs();
  }, [artist, ignoreSongId]);
  return { artistSongs, loading };
};
export default useSpotifyArtistSongs;
