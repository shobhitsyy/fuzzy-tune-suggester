
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Song } from "@/utils/fuzzyLogic";

// LocalStorage-based guest rating util
const getLocalRating = (songId: string): number | null => {
  const val = localStorage.getItem(`song_rating_${songId}`);
  return val ? Number(val) : null;
};
const setLocalRating = (songId: string, rating: number) => {
  localStorage.setItem(`song_rating_${songId}`, `${rating}`);
};

interface SongCardActionsProps {
  song: Song;
}

const SongCardActions: React.FC<SongCardActionsProps> = ({ song }) => {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(getLocalRating(song.id));
  }, [song.id]);

  const handleRating = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rating !== null) {
      return;
    }
    setRating(star);
    setLocalRating(song.id, star);
  };

  return (
    <div className="flex gap-2 mt-2 items-center">
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= (rating ?? 0)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
            onClick={rating === null ? (e) => handleRating(star, e) : undefined}
            strokeWidth={star <= (rating ?? 0) ? 0 : 2}
            fill={star <= (rating ?? 0) ? '#facc15' : 'none'}
            style={{
              opacity: rating !== null ? 0.7 : 1,
              pointerEvents: rating !== null ? "none" : "auto"
            }}
          />
        ))}
        <span className="ml-2 text-xs text-gray-600">
          {rating != null ? `Your rating: ${rating}` : "Rate"}
        </span>
      </div>
    </div>
  );
};
export default SongCardActions;
