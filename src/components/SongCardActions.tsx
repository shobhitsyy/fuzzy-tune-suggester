
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Song } from "@/utils/fuzzyLogic";

// Simple localstorage rating logic
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
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  // Fake average rating for demo: this would be fetched from a backend in a real app
  // Here, we'll generate a semi-random value based on id for demo purposes
  useEffect(() => {
    setRating(getStoredRating(song.id));
    // For demo, mimic a fixed average: count 15, avg 4.1. In real app, fetch from API.
    setAvgRating(4.1 + ((song.id.charCodeAt(0) % 10) / 16));
    setRatingCount(15 + (song.id.charCodeAt(1) % 5));
  }, [song.id]);

  const handleRating = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rating !== null) return; // only once
    setStoredRating(song.id, star);
    setRating(star);
    // In a real app, you would now send star to backend and refetch average.
  };

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
          {avgRating !== null
            ? `(${avgRating.toFixed(1)} stars • ${ratingCount})`
            : "(No reviews)"}
        </span>
      </div>
    </div>
  );
};

export default SongCardActions;
