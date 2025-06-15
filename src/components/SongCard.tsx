
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Song } from "@/utils/fuzzyLogic";
import SongDetail from "@/components/SongDetail";

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <Card
        className="music-card relative overflow-hidden rounded-xl border-0 hover:shadow-2xl shadow-md transition-all duration-200 cursor-pointer group bg-white"
        onClick={() => setDetailOpen(true)}
      >
        <div className="aspect-square overflow-hidden bg-gray-50 w-full">
          <img
            src={song.coverImage}
            alt={`${song.title} by ${song.artist}`}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4 flex flex-col gap-1">
          <span className="font-bold text-lg truncate">{song.title}</span>
          <span className="text-sm text-gray-500 truncate">{song.artist}</span>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {song.language}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {song.category}
            </span>
          </div>
        </CardContent>
      </Card>
      <SongDetail song={song} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
};

export default SongCard;
