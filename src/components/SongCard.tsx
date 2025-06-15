
import React, { useState } from "react";
import { Song } from "@/utils/fuzzyLogic";
import SongCardTags from "@/components/SongCardTags";
import SongDetail from "@/components/SongDetail";
import SongCardActions from "@/components/SongCardActions";

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => setShowDetails(true);
  const handleClose = () => setShowDetails(false);

  return (
    <>
      <div
        className="relative group rounded-2xl glass-card shadow-lg transition transform hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden border border-gray-200"
        onClick={handleCardClick}
        tabIndex={0}
        aria-label={`Show details for ${song.title}`}
      >
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={song.coverImage}
            alt={song.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            draggable={false}
          />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{song.title}</h3>
          <p className="text-sm text-gray-500 truncate">{song.artist}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded font-medium capitalize">
              {song.language}
            </span>
            <span className="text-xs text-gray-400">{song.duration}</span>
          </div>
          {/* Tags */}
          <div>
            <SongCardTags tags={song.tags} />
          </div>
          {/* Actions - Show on desktop as hover, always on mobile */}
          <div className="hidden sm:block group-hover:block">
            <SongCardActions song={song} />
          </div>
        </div>
        {/* Add a subtle overlay on hover for effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all pointer-events-none" />
      </div>
      {/* Always render actions below on mobile for touch friendliness */}
      <div className="sm:hidden mt-2">
        <SongCardActions song={song} />
      </div>
      {showDetails && (
        <SongDetail song={song} isOpen={showDetails} onClose={handleClose} />
      )}
    </>
  );
};

export default SongCard;

