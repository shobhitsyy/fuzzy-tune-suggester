
import React, { useState } from "react";
import { Song } from "@/utils/fuzzyLogic";
import SongCardTags from "@/components/SongCardTags";
import SongDetail from "@/components/SongDetail";

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
        className="bg-white rounded-xl shadow group cursor-pointer border-0 hover:shadow-lg transition-transform duration-200 overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={song.coverImage}
            alt={song.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-base truncate">{song.title}</h3>
          <p className="text-xs text-gray-500 truncate">{song.artist}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 capitalize">
              {song.language}
            </span>
            <span className="text-xs text-gray-400">{song.duration}</span>
          </div>
          <SongCardTags tags={song.tags} />
        </div>
      </div>
      {showDetails && (
        <SongDetail song={song} isOpen={showDetails} onClose={handleClose} />
      )}
    </>
  );
};

export default SongCard;

