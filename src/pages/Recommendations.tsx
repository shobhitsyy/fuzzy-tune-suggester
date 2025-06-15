import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SongDetail from '@/components/SongDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MoodParams, determineSongCategory, Song } from '@/utils/fuzzyLogic';
import { getRecommendedSongs } from '@/services/songService';
import { useToast } from '@/hooks/use-toast';
import RecommendationGrid from '@/components/RecommendationGrid';
import RecommendationSkeletonGrid from '@/components/RecommendationSkeletonGrid';
import RecommendationEmptyState from '@/components/RecommendationEmptyState';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { moodParams, includeEnglish, includeHindi, maxSongs } = location.state || {};
  
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!moodParams) {
      navigate('/');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const { category, memberships } = determineSongCategory(moodParams);
        // Unlimited number of songs; remove or set high count
        const songs = await getRecommendedSongs(
          category,
          memberships,
          maxSongs || 1000, // default high number if not set
          includeEnglish,
          includeHindi
        );
        setRecommendedSongs(songs);
        if (songs.length === 0) {
          toast({
            title: "No Songs Found",
            description: "No songs match your current preferences. Try adjusting your settings.",
          });
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to get song recommendations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [moodParams, includeEnglish, includeHindi, navigate, toast, maxSongs]);

  const handleSongSelect = (song: Song) => setSelectedSong(song);
  const handleBackToHome = () => navigate('/');

  const { category } = moodParams ? determineSongCategory(moodParams) : { category: '' };

  if (!moodParams) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={handleBackToHome}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎵 Your Music Recommendations
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Curated for your <span className="text-purple-600 font-semibold">{category}</span> mood
            </p>
            <p className="text-sm text-gray-500">
              Languages: {includeEnglish && includeHindi ? 'English & Hindi' : includeEnglish ? 'English' : 'Hindi'}
            </p>
          </div>
        </div>
        {isLoading ? (
          <RecommendationSkeletonGrid />
        ) : recommendedSongs.length > 0 ? (
          <>
            <RecommendationGrid
              recommendedSongs={recommendedSongs}
              onSongSelect={handleSongSelect}
            />
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Found {recommendedSongs.length} songs matching your mood
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
        {selectedSong && (
          <SongDetail
            song={selectedSong}
            isOpen={!!selectedSong}
            onClose={() => setSelectedSong(null)}
            onSelectSimilar={handleSongSelect}
          />
        )}
      </div>
    </div>
  );
};

export default Recommendations;
