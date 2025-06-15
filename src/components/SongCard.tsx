
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SongCardActions from "@/components/SongCardActions";
import SongCardTags from "@/components/SongCardTags";
import { Song } from "@/utils/fuzzyLogic";
import useSpotifyArtistSongs from "@/hooks/useSpotifyArtistSongs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SongCardProps {
  song: Song;
  onClick?: (song: Song) => void;
}
const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [expanded, setExpanded] = useState(false);
  const { artistSongs, loading: artistLoading } = useSpotifyArtistSongs(song.artist, song.id);

  // Similar songs could come from parent or own props in a future version.
  // For now, let's just have an empty list (or show a prop if supplied)

  return (
    <div className="relative">
      <Card
        onClick={() => setExpanded((e) => !e)}
        className={`transition-all duration-500 overflow-hidden ${
          expanded
            ? "fixed top-0 left-0 z-50 w-full h-full bg-white rounded-none shadow-2xl p-0 flex"
            : "bg-white rounded-lg shadow hover:shadow-lg hover:scale-105 duration-200 cursor-pointer"
        }`}
        style={expanded ? { maxWidth: "none", maxHeight: "none" } : {}}
      >
        {!expanded ? (
          // NORMAL condensed card
          <div>
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src={song.coverImage} alt={`${song.title} by ${song.artist}`}
                className="object-cover w-full h-full duration-200" />
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm truncate">{song.title}</span>
                <Badge variant="secondary" className="bg-gray-200 text-xs ml-2">{song.category}</Badge>
              </div>
              <span className="block text-xs text-muted-foreground">{song.artist}</span>
              <SongCardTags tags={song.tags} />
              <SongCardActions song={song} />
            </div>
          </div>
        ) : (
          // EXPANDED card UI (overlay/fullscreen)
          <div className="flex w-full h-full max-h-screen">
            {/* Cover Image on Top */}
            <div className="flex flex-col items-center w-2/5 min-w-[280px] max-w-[440px] bg-gradient-to-b from-gray-50 via-white to-pink-50 p-6 border-r">
              <img
                src={song.coverImage}
                alt={`${song.title} by ${song.artist}`}
                className="rounded-xl shadow-lg w-full aspect-square object-cover transition-all anim-fade-in"
              />
              <span className="mt-4 text-xs text-gray-400">{song.duration}</span>
            </div>
            {/* Details on the left */}
            <div className="flex flex-col justify-between w-1/3 py-8 px-7">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{song.title}</h2>
                <p className="text-lg mb-2 text-purple-700 font-semibold">{song.artist}</p>
                <p className="text-xs text-gray-400 mb-3">
                  Album: <span className="font-medium">{song.album}</span> <br />
                  Release: {song.releaseDate} <br />
                  Language: {song.language}
                </p>
                <Badge className="mb-2">{song.category}</Badge>
                <p className="mb-3 text-gray-500">{song.description || "No description."}</p>
                {/* Actions */}
                <SongCardActions song={song} />
                <SongCardTags tags={song.tags} />
              </div>
              <Button onClick={e => {e.stopPropagation(); setExpanded(false);}} className="mt-6" variant="ghost">
                Close
              </Button>
            </div>
            {/* Songs by artist & similar songs */}
            <div className="flex-grow flex flex-col justify-start min-w-[270px] p-7 bg-gray-50 border-l overflow-y-auto">
              <h3 className="font-semibold text-lg mb-2">Songs by this Artist</h3>
              {artistLoading ? (
                <div className="text-sm text-gray-400">Loading songs...</div>
              ) : (
                <ul className="space-y-3 mb-6">
                  {artistSongs.length === 0 && <li className="text-xs text-gray-400">No songs found.</li>}
                  {artistSongs.map((track) => (
                    <li key={track.id} className="flex gap-2 items-center">
                      <img src={track.cover} alt={track.title} className="w-9 h-9 object-cover rounded shadow" />
                      <div>
                        <span className="block font-medium text-sm">{track.title}</span>
                        <span className="block text-xs text-gray-500">{track.album}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* Place for similar songs (can be integrated from your future work) */}
              {/* <SimilarSongsList songId={song.id}/> */}
            </div>
          </div>
        )}
      </Card>
      {expanded && <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm anim-fade-in"
        onClick={() => setExpanded(false)}
      />}
    </div>
  );
};
export default SongCard;
