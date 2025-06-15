import React, { useEffect, useState } from "react";
import { Song } from "@/utils/fuzzyLogic";
import SongCardActions from "@/components/SongCardActions";

interface SongDetailProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}

const fetchSongsByArtist = async (artist: string, excludeTitle: string): Promise<SpotifyTrack[]> => {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=10`,
      {
        headers: {
          // This assumes a valid Spotify CLIENT TOKEN is stored and available.
          "Authorization": `Bearer ${localStorage.getItem("spotify_client_token") || ""}`,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const filtered: SpotifyTrack[] =
      data?.tracks?.items
        ?.filter(
          (t: any) =>
            t?.name &&
            t.name.toLowerCase() !== excludeTitle.toLowerCase() &&
            t.artists.find((a: any) => a.name.toLowerCase() === artist.toLowerCase())
        )
        .slice(0, 3)
        .map((track: any) => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
        })) || [];
    return filtered;
  } catch {
    return [];
  }
};

const SongDetail: React.FC<SongDetailProps> = ({
  song,
  isOpen,
  onClose,
}) => {
  const [otherSongs, setOtherSongs] = useState<SpotifyTrack[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetchSongsByArtist(song.artist, song.title).then(setOtherSongs);
  }, [isOpen, song.artist, song.title]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl p-0 overflow-auto relative">
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          ×
        </button>
        <div className="p-4">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover"
          />
          <h2 className="text-2xl font-bold text-center mb-1">{song.title}</h2>
          <p className="text-center text-gray-600 mb-1">{song.artist}</p>
          {song.description && (
            <p className="mb-4 text-gray-500 text-center">{song.description}</p>
          )}
          <div className="flex justify-center mt-4">
            <SongCardActions song={song} />
          </div>
          {otherSongs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Songs by this Artist
              </h3>
              <ul className="space-y-1">
                {otherSongs.map((track) => (
                  <li key={track.id} className="text-center text-sm text-gray-700">
                    {track.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SongDetail;
