
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SongCard from '@/components/SongCard';
import SongDetail from '@/components/SongDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MoodParams, determineSongCategory, Song } from '@/utils/fuzzyLogic';
import { getRecommendedSongs } from '@/services/songService';
import { useToast } from '@/hooks/use-toast';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { moodParams, includeEnglish, includeHindi } = location.state || {};
  
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
        console.log('Fetching recommendations for category:', category);
        
        const songs = await getRecommendedSongs(
          category,
          memberships,
          40, // Increased: Allow up to 40 recommendations
          includeEnglish,
          includeHindi
        );
        
        console.log('Fetched songs:', songs.length);
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
  }, [moodParams, includeEnglish, includeHindi, navigate, toast]);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const { category } = moodParams ? determineSongCategory(moodParams) : { category: '' };

  if (!moodParams) {
    return null;
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendedSongs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onClick={() => handleSongSelect(song)}
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Found {recommendedSongs.length} songs matching your mood
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {!includeEnglish && !includeHindi 
                ? "Please select at least one language to see recommendations."
                : "No songs found for your current mood. Try adjusting your preferences!"
              }
            </p>
            <Button 
              onClick={handleBackToHome}
              className="mt-4"
            >
              Adjust Settings
            </Button>
          </div>
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
