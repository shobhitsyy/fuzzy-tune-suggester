
import React from "react";
import SongCard from "@/components/SongCard";
import { Song } from "@/utils/fuzzyLogic";

interface RecommendationGridProps {
  recommendedSongs: Song[];
  onSongSelect?: (song: Song) => void;
}

const RecommendationGrid: React.FC<RecommendationGridProps> = ({
  recommendedSongs,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {recommendedSongs.map((song) => (
      <SongCard
        key={song.id}
        song={song}
      />
    ))}
  </div>
);

export default RecommendationGrid;
