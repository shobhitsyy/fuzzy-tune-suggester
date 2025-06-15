
import React, { useState } from "react";
import { SongRecommendation } from "@/services/recommendationService";

interface SongCardProps {
  song: SongRecommendation;
  onClick?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleCardClick = () => setShowDetail(true);
  const handleClose = () => setShowDetail(false);

  return (
    <>
      {/* Song Card */}
      <div
        role="button"
        className="
          group relative rounded-xl bg-gradient-to-br from-[#f4ecff] to-[#eaf8fa] 
          shadow-xl hover:shadow-2xl mb-3 cursor-pointer
          border border-purple-100 overflow-hidden 
          transition-all duration-200 
          hover:scale-[1.035] 
          flex flex-col items-stretch
        "
        tabIndex={0}
        aria-label={`Open ${song.title} by ${song.artist}`}
        onClick={handleCardClick}
      >
        {/* Cover image */}
        <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
          <img
            src={song.cover_image || "/placeholder.svg"}
            alt={`${song.title} album cover`}
            className="object-cover w-full h-full transition-transform duration-600 group-hover:scale-110 rounded-t-xl"
            draggable={false}
          />
          {/* Category Bubble */}
          <span className="absolute top-2 right-2 bg-purple-600/90 text-white text-xs px-2 py-1 rounded-full shadow font-semibold uppercase tracking-wider z-10">
            {song.category}
          </span>
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col gap-2 px-4 py-3 bg-white bg-opacity-90 ">
          <h3 className="text-lg font-bold text-gray-800 leading-tight truncate">{song.title}</h3>
          <span className="text-sm text-gray-600 font-medium truncate">{song.artist}</span>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="bg-blue-100 text-blue-700 font-medium rounded px-2 py-0.5">{song.language}</span>
            {song.album && (
              <span className="ml-auto text-gray-400 text-xs truncate">{song.album}</span>
            )}
          </div>
          {song.release_date && (
            <div className="text-gray-400 text-xs">{song.release_date}</div>
          )}
        </div>
      </div>

      {/* Fullscreen Song Detail overlay */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-purple-200">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-3xl font-bold"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={song.cover_image || "/placeholder.svg"}
              alt={song.title}
              className="w-44 h-44 rounded-xl object-cover mx-auto mb-4 shadow"
              draggable={false}
            />
            <h2 className="text-2xl font-bold text-center mb-1">{song.title}</h2>
            <p className="text-center text-gray-600 mb-2">{song.artist}</p>
            <div className="text-center text-xs text-gray-400 mb-2">{song.album} {song.release_date && ` • ${song.release_date}`}</div>
            <div className="flex flex-row items-center justify-center gap-2 mt-2 mb-3">
              <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-semibold uppercase">{song.category}</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{song.language}</span>
            </div>
            {/* Actions could be added here if needed */}
          </div>
        </div>
      )}
    </>
  );
};

export default SongCard;
