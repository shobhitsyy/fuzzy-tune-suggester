
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Play } from "lucide-react";
import { Song } from "@/utils/fuzzyLogic";
import { getSongsByCategory } from "@/services/songService";

interface SongDetailProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
}
const SongDetail: React.FC<SongDetailProps> = ({ song, open, onClose }) => {
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (song && open) {
      setLoading(true);
      // Fetch songs by this artist (from database), excluding the current song
      (async () => {
        // Query all categories for the artist
        const allByArtist: Song[] = (
          await Promise.all([
            getSongsByCategory("upbeat", undefined), // We'll filter below
            getSongsByCategory("party", undefined),
            getSongsByCategory("uplifting", undefined),
            getSongsByCategory("motivational", undefined),
            getSongsByCategory("calm", undefined),
            getSongsByCategory("relaxing", undefined),
            getSongsByCategory("romantic", undefined),
            getSongsByCategory("nostalgic", undefined),
            getSongsByCategory("happy", undefined),
            getSongsByCategory("melancholic", undefined),
            getSongsByCategory("study", undefined),
            getSongsByCategory("sad", undefined)
          ])
        ).flat();
        const uniqueByArtist = allByArtist
          .filter(s => s.artist.toLowerCase() === song.artist.toLowerCase())
          .filter(s => s.id !== song.id);
        setArtistSongs(uniqueByArtist);
        setLoading(false);
      })();
    } else {
      setArtistSongs([]);
    }
  }, [song, open]);

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent className="max-w-2xl w-full p-0 bg-background rounded-2xl border-0 shadow-2xl overflow-hidden animate-fade-in relative">
        {/* One close button, always at top right */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="w-full flex flex-col">
          {/* Cover image */}
          <div className="relative w-full h-56 md:h-60 bg-black/10 flex items-center justify-center">
            <img
              src={song.coverImage}
              alt={song.title}
              className="object-cover w-full h-full rounded-t-2xl shadow-xl"
              style={{ maxHeight: "18rem" }}
            />
          </div>
          {/* Details and other songs */}
          <div className="flex flex-col md:flex-row w-full px-4 md:px-6 py-6 gap-6 bg-white rounded-b-2xl">
            {/* Song details, left for desktop */}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-xl md:text-2xl mb-1 capitalize break-words">{song.title}</h2>
              <span className="font-semibold text-md text-purple-700">{song.artist}</span>
              <div className="text-xs text-gray-500 mt-1">
                <div><b>Album:</b> <span className="font-medium">{song.album}</span></div>
                <div><b>Released:</b> {song.releaseDate}</div>
                <div><b>Language:</b> {song.language}</div>
                <div><b>Duration:</b> {song.duration}</div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                <Badge className="capitalize">{song.category}</Badge>
                {song.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-1 mb-2 break-words">
                {song.description || <span className="italic text-gray-400">No description.</span>}
              </p>
              {song.spotifyUrl && (
                <Button
                  className="bg-[#1DB954] hover:bg-[#169944] text-white font-bold mt-3"
                  onClick={() => window.open(song.spotifyUrl, "_blank")}
                  size="sm"
                >
                  <Play className="mr-2 h-4 w-4" /> Play on Spotify
                </Button>
              )}
            </div>
            {/* Right side: Songs by this artist */}
            <div className="flex-1 min-w-[180px] max-w-[320px] pt-3 pb-1 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100">
              <span className="font-semibold text-lg block mb-3 text-primary text-left">Songs by this Artist</span>
              {loading ? (
                <div className="text-xs text-gray-400">Loading songs…</div>
              ) : artistSongs.length === 0 ? (
                <div className="text-xs text-gray-400">No other songs found.</div>
              ) : (
                <ul className="space-y-3">
                  {artistSongs.map((track) => (
                    <li key={track.id} className="flex gap-2 items-center hover:bg-gray-50 rounded p-1 transition-all cursor-pointer">
                      <img src={track.coverImage} alt={track.title} className="w-10 h-10 object-cover rounded shadow" />
                      <div className="flex flex-col min-w-0">
                        <span className="block font-medium text-sm truncate">{track.title}</span>
                        <span className="block text-xs text-gray-500 truncate">{track.album}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Mobile-specific tweaks */}
        <style>{`
          @media (max-width: 640px) {
            .dialog-content {
              padding: 0 !important;
              border-radius: 0.75rem !important;
            }
            .rounded-t-2xl {
              border-radius: 1rem 1rem 0 0 !important;
            }
            .rounded-b-2xl {
              border-radius: 0 0 1rem 1rem !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
export default SongDetail;
