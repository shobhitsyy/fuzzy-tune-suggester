
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Song } from "@/utils/fuzzyLogic";

interface SongCardProps {
  song: Song;
  onClick?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <Card
      className="music-card relative overflow-hidden rounded-2xl bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-200 cursor-pointer group"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Show details for ${song.title} by ${song.artist}`}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick();
        }
      }}
    >
      <div className="aspect-[1.1/1] overflow-hidden bg-gray-50 w-full rounded-t-2xl">
        <img
          src={song.coverImage}
          alt={`${song.title} by ${song.artist}`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4 pb-5 flex flex-col gap-2">
        <span className="font-bold text-lg truncate">{song.title}</span>
        <span className="text-sm text-gray-500 truncate">{song.artist}</span>
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className="text-gray-400">{song.language}</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{song.category}</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default SongCard;
