import React from "react";
import { Song } from "@/utils/fuzzyLogic";
import SongCardActions from "@/components/SongCardActions";

interface SongDetailProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onSelectSimilar: (song: Song) => void;
}

const SongDetail: React.FC<SongDetailProps> = ({
  song,
  isOpen,
  onClose,
  onSelectSimilar,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animated fade-in">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl p-0 overflow-auto relative">
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          ×
        </button>
        {/* Main card content */}
        <div className="p-4">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover"
          />
          <h2 className="text-2xl font-bold text-center mb-1">{song.title}</h2>
          <p className="text-center text-gray-600 mb-1">{song.artist}</p>
          {/* Lyric snippet */}
          <div className="flex justify-center mb-4">
            <span className="block text-sm italic text-gray-700">
              {song.lyric_snippet ? `“${song.lyric_snippet}”` : ''}
            </span>
          </div>
          {/* Description */}
          {song.description &&
            <p className="mb-4 text-gray-500 text-center">{song.description}</p>
          }
          {/* No Similar Songs Heading or List */}
          <div className="flex justify-center mt-4">
            <SongCardActions song={song} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SongDetail;
