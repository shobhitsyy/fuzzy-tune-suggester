
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MoodParams, determineSongCategory, Song } from '@/utils/fuzzyLogic';
import { getRecommendedSongs } from '@/services/songService';
import { useToast } from '@/hooks/use-toast';
import RecommendationGrid from '@/components/RecommendationGrid';
import RecommendationSkeletonGrid from '@/components/RecommendationSkeletonGrid';
import RecommendationEmptyState from '@/components/RecommendationEmptyState';
import SongDetail from '@/components/SongDetail';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { moodParams, includeEnglish, includeHindi, maxSongs } = location.state || {};
  
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [shownCount, setShownCount] = useState(50);
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

        const desiredMax = Math.max(shownCount, maxSongs || 1000);

        const allSongs = await getRecommendedSongs(
          category,
          memberships,
          desiredMax,
          includeEnglish,
          includeHindi
        );

        const sorted = allSongs
          .map(song => ({
            song,
            membership: memberships[song.category] ?? 0
          }))
          .sort((a, b) => b.membership - a.membership);

        const seenIds = new Set();
        const deduped: Song[] = [];
        for (const { song } of sorted) {
          if (!seenIds.has(song.id)) {
            seenIds.add(song.id);
            deduped.push(song);
          }
        }

        setRecommendedSongs(deduped.slice(0, desiredMax));
        if (deduped.length === 0) {
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
    // eslint-disable-next-line
  }, [moodParams, includeEnglish, includeHindi, navigate, shownCount, toast, maxSongs]);

  const handleSongSelect = (song: Song) => setSelectedSong(song);
  const handleBackToHome = () => navigate('/');

  const handleShowMore = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShownCount(Number(event.target.value));
  };

  const { category } = moodParams ? determineSongCategory(moodParams) : { category: '' };

  if (!moodParams) return null;

  // Dropdown options: 50, 100, 200, 500, 1000
  const dropdownOptions = [50, 100, 200, 500, 1000];

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
          <div className="flex justify-center mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-500">
              Show:&nbsp;
              <select 
                className="border-gray-300 rounded px-2 py-1"
                value={shownCount}
                onChange={handleShowMore}
              >
                {dropdownOptions.map(opt => (
                  <option key={opt} value={opt}>{opt} songs</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {isLoading ? (
          <RecommendationSkeletonGrid />
        ) : recommendedSongs.length > 0 ? (
          <>
            <RecommendationGrid
              recommendedSongs={recommendedSongs.slice(0, shownCount)}
              onSongSelect={handleSongSelect}
            />
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Found {recommendedSongs.length} songs matching your mood
              </p>
              {recommendedSongs.length > shownCount && (
                <p className="text-xs text-gray-400">
                  Showing top {shownCount} — use selector above for more
                </p>
              )}
            </div>
          </>
        ) : (
          <RecommendationEmptyState
            includeEnglish={includeEnglish}
            includeHindi={includeHindi}
            onBack={handleBackToHome}
          />
        )}
        {/* Single SongDetail displayed here, modal managed at page level */}
        <SongDetail song={selectedSong} open={!!selectedSong} onClose={() => setSelectedSong(null)} />
      </div>
    </div>
  );
};

export default Recommendations;

