
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import RecommendationEmptyState from "@/components/RecommendationEmptyState";
import SongCard from "@/components/SongCard";
import { useRecommendations } from "@/hooks/useRecommendations";
import RecommendationSkeletonGrid from "@/components/RecommendationSkeletonGrid";

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { moodParams, includeEnglish, includeHindi, maxSongs } = location.state || {};
  const { loading, error, recommendations, getRecommendations } = useRecommendations({
    includeEnglish,
    includeHindi,
    maxSongs: maxSongs ?? 20,
  });

  useEffect(() => {
    if (!moodParams) {
      navigate("/");
      return;
    }
    getRecommendations(moodParams);
    // eslint-disable-next-line
  }, [moodParams, includeEnglish, includeHindi, maxSongs]);

  const handleBackToHome = () => navigate("/");

  if (!moodParams) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={handleBackToHome} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">
              🎵 Your Music Recommendations
            </h1>
            <p className="text-lg text-gray-600 mb-2">Songs personalized for your mood</p>
            <p className="text-sm text-gray-500">
              Languages:{" "}
              {includeEnglish && includeHindi
                ? "English & Hindi"
                : includeEnglish
                ? "English"
                : "Hindi"}
            </p>
          </div>
        </div>
        {loading ? (
          <RecommendationSkeletonGrid />
        ) : error ? (
          <div className="text-center text-red-600 my-10">{error}</div>
        ) : recommendations && recommendations.length > 0 ? (
          <>
            <div className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7
              animate-fade-in
            ">
              {recommendations.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Found {recommendations.length} songs matching your mood
              </p>
            </div>
          </>
        ) : (
          <RecommendationEmptyState
            includeEnglish={includeEnglish}
            includeHindi={includeHindi}
            onBack={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
};

export default Recommendations;
