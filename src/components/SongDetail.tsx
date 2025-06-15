import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Song } from "@/utils/fuzzyLogic";
import { getSongsByCategory } from "@/services/songService";

interface SongDetailProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
}
const CATEGORIES: Song["category"][] = [
  "energetic","upbeat","moderate","relaxed","calm"
];

const SongDetail: React.FC<SongDetailProps> = ({ song, open, onClose }) => {
  // "Songs by this Artist" now powered by real database
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (song && open) {
      setLoading(true);
      (async () => {
        let all: Song[] = [];
        for (let cat of CATEGORIES) {
          const data = await getSongsByCategory(cat, undefined);
          all.push(...data);
        }
        const filtered = all
          .filter(s => s.artist.toLowerCase() === song.artist.toLowerCase())
          .filter(s => s.id !== song.id);
        setArtistSongs(filtered);
        setLoading(false);
      })();
    } else {
      setArtistSongs([]);
    }
  }, [song, open]);

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent className="max-w-md w-[98vw] p-0 bg-background shadow-2xl rounded-t-3xl rounded-b-lg border-0 mobile-modal-dc relative">
        <DialogTitle className="sr-only">{song.title} by {song.artist}</DialogTitle>
        <DialogDescription className="sr-only">{song.album}, {song.releaseDate}</DialogDescription>
        {/* Single close button */}
        <button
          type="button"
          aria-label="Close"
          className="absolute z-10 top-3 right-3 bg-black/60 text-white rounded-full hover:bg-black/90 p-2"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        {/* Top Cover Image Section */}
        <div className="relative w-full h-40 sm:h-48 rounded-t-3xl overflow-hidden flex items-end justify-start bg-gray-100">
          <img
            src={song.coverImage}
            alt={song.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/75 via-black/10 to-transparent px-5 pt-8 pb-4 text-white rounded-t-3xl">
            <div className="font-bold text-xl md:text-2xl mb-1 break-words leading-tight drop-shadow">{song.title}</div>
            <div className="text-sm font-medium text-gray-200 drop-shadow">{song.artist}</div>
          </div>
        </div>
        {/* Details Section */}
        <div className="bg-white rounded-b-lg px-5 py-5">
          {/* Song Details Title */}
          <div className="font-semibold flex items-center gap-2 mb-3 text-lg text-gray-800">
            <span className="inline-block"><svg fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" viewBox="0 0 24 24" className="inline-block"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg></span>
            Song Details
          </div>
          <div className="flex flex-col gap-2 text-[15px] text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">Album</span>
              <span className="font-medium text-gray-800">{song.album}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration</span>
              <span className="flex items-center gap-2">
                <svg className="inline-block" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {song.duration}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Release Date</span>
              <span className="flex items-center gap-2">
                <svg className="inline-block" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                {song.releaseDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Language</span>
              <span>{song.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category</span>
              <span className="capitalize">{song.category}</span>
            </div>
          </div>
          {song.description && (
            <p className="mt-4 text-gray-700 text-[15px] leading-[1.6]">{song.description}</p>
          )}
        </div>
        {/* Songs by this artist */}
        <div className="bg-white rounded-b-lg px-5 pb-6">
          <div className="font-semibold text-md mt-6 mb-2 text-primary">
            {loading ? "Loading more by this artist..." : "More by this artist"}
          </div>
          {(!loading && artistSongs.length === 0) && (
            <div className="text-gray-400 text-sm">No other songs found.</div>
          )}
          {(artistSongs.length > 0) &&
            <ul className="divide-y divide-gray-100">
              {artistSongs.map(track => (
                <li key={track.id} className="flex items-center gap-3 py-2">
                  <img src={track.coverImage} alt={track.title} className="w-9 h-9 object-cover rounded shadow" />
                  <div>
                    <div className="font-medium text-[15px] text-gray-700 truncate">{track.title}</div>
                    <div className="text-xs text-gray-500 truncate">{track.album}</div>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
        <style>{`
        @media (max-width: 640px) {
          .mobile-modal-dc { padding: 0 !important; max-width: 99vw !important; }
        }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default SongDetail;
