
import { useState } from "react";
import { RecommendationService, MoodParams, SongRecommendation } from "@/services/recommendationService";

interface UseRecommendationsProps {
  includeEnglish: boolean;
  includeHindi: boolean;
  maxSongs?: number;
}

export function useRecommendations({
  includeEnglish,
  includeHindi,
  maxSongs = 20,
}: UseRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>([]);

  const getRecommendations = async (moodParams: MoodParams) => {
    setLoading(true);
    setError(null);

    try {
      const songs = await RecommendationService.getRecommendations(
        moodParams,
        includeEnglish,
        includeHindi,
        maxSongs
      );
      setRecommendations(songs);
      if (!songs.length) setError("No recommendations found. Try adjusting your mood or language.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to get recommendations"
      );
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarSongs = async (songId: string, limit: number = 5) => {
    try {
      return await RecommendationService.getSimilarSongs(songId, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get similar songs');
      return [];
    }
  };

  return {
    loading,
    error,
    recommendations,
    getRecommendations,
    getSimilarSongs,
  };
}
