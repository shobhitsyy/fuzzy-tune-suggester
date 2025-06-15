
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Song } from "@/utils/fuzzyLogic";

// Localstorage rating logic
const localKey = (songId: string) => `song-rating-${songId}`;

const getStoredRating = (songId: string) => {
  const saved = localStorage.getItem(localKey(songId));
  return saved ? Number(saved) : null;
};

const setStoredRating = (songId: string, rating: number) => {
  localStorage.setItem(localKey(songId), rating.toString());
};

interface SongCardActionsProps {
  song: Song;
}

const SongCardActions: React.FC<SongCardActionsProps> = ({ song }) => {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(getStoredRating(song.id));
  }, [song.id]);

  const handleRating = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rating !== null) return; // only once
    setStoredRating(song.id, star);
    setRating(star);
  };

  // No dummy reviews, just show user rating or prompt to rate
  return (
    <div className="flex gap-2 mt-2 items-center justify-center">
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= (rating ?? 0)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
            onClick={rating !== null ? undefined : (e) => handleRating(star, e)}
            strokeWidth={star <= (rating ?? 0) ? 0 : 2}
            fill={star <= (rating ?? 0) ? "#facc15" : "none"}
            style={{
              opacity: rating !== null ? 0.7 : 1,
              pointerEvents: rating !== null ? "none" : "auto",
            }}
          />
        ))}
        <span className="ml-2 text-xs text-gray-600">
          {rating !== null ? `(You rated ${rating} stars)` : "(Rate this song!)"}
        </span>
      </div>
    </div>
  );
};

export default SongCardActions;
