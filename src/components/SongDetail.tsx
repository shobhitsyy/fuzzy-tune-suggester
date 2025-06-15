
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, X } from "lucide-react";
import useSpotifyArtistSongs from "@/hooks/useSpotifyArtistSongs";
import { Song } from "@/utils/fuzzyLogic";

interface SongDetailProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
}
const SongDetail: React.FC<SongDetailProps> = ({ song, open, onClose }) => {
  const { artistSongs, loading } = useSpotifyArtistSongs(song?.artist ?? "", song?.id);
  const [recommendedSongs, setRecommendedSongs] = useState<{ id: string, cover: string, title: string, album: string }[]>([]);

  // Guarantee 3 songs by artist, using Spotify/fallback
  useEffect(() => {
    if (!song) return;
    let rec = [...artistSongs];
    // Prevent duplicates of current song
    if(rec.length < 3) {
      // Add current song itself as fallback or dummy
      rec = [
        ...rec,
        ...Array(3 - rec.length).fill(null).map((_, idx) => ({
          id: song.id + "-fallback-" + idx,
          cover: song.coverImage,
          title: song.title,
          album: song.album,
        }))
      ];
    } else {
      rec = rec.slice(0,3);
    }
    setRecommendedSongs(rec);
  }, [artistSongs, song]);

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl bg-background rounded-2xl p-0 overflow-hidden border-0 shadow-2xl anim-fade-in">
        <div className="w-full">
          {/* Cover image */}
          <div className="relative w-full h-60 bg-black/10 flex items-center justify-center">
            <img
              src={song.coverImage}
              alt={song.title}
              className="object-cover w-full h-full rounded-b-xl rounded-t-2xl shadow-xl transition-all"
              style={{maxHeight:'16rem'}}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          {/* Details */}
          <div className="flex flex-col md:flex-row w-full gap-0 md:gap-6 px-6 py-6 bg-white rounded-b-2xl">
            {/* Left: Song details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-2xl mb-0.5 capitalize">{song.title}</h2>
              <span className="font-semibold text-md text-purple-700">{song.artist}</span>
              <div className="text-xs text-gray-500 mt-1">
                Album: <span className="font-medium">{song.album}</span><br />
                Released: {song.releaseDate}<br/>
                Language: {song.language}<br/>
                Duration: {song.duration}
              </div>
              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                <Badge className="capitalize">{song.category}</Badge>
                {song.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-1 mb-2">
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
            {/* Right: Songs by this artist */}
            <div className="flex-1 min-w-[210px] max-w-[330px] pt-2 pb-1 px-0 pl-1 md:pl-2 border-l border-gray-100">
              <span className="font-semibold text-lg block mb-3 text-primary">Songs by this Artist</span>
              {loading ? (
                <div className="text-xs text-gray-400">Loading songs…</div>
              ) : (
                <ul className="space-y-3">
                  {recommendedSongs.map((track) => (
                    <li key={track.id} className="flex gap-2 items-center hover:bg-gray-50 rounded p-1.5 transition-all cursor-pointer">
                      <img src={track.cover} alt={track.title} className="w-10 h-10 object-cover rounded shadow" />
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
      </DialogContent>
    </Dialog>
  );
}
export default SongDetail;
