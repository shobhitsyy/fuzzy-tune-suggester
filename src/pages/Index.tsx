
import { useState, useEffect } from 'react';
import MoodSelector from '@/components/MoodSelector';
import SongCard from '@/components/SongCard';
import SongDetail from '@/components/SongDetail';
import { Button } from '@/components/ui/button';
import { MoodParams, determineSongCategory, Song } from '@/utils/fuzzyLogic';
import { 
  populateDatabase, 
  isDatabasePopulated, 
  getRecommendedSongs,
  getSimilarSongs 
} from '@/services/songService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [moodParams, setMoodParams] = useState<MoodParams>({
    heartRate: 75,
    timeOfDay: new Date().getHours(),
    activity: 5,
    mood: 5
  });

  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  // Initialize database on component mount
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsInitializing(true);
        const isPopulated = await isDatabasePopulated();
        
        if (!isPopulated) {
          console.log('Database not populated, initializing...');
          await populateDatabase();
          toast({
            title: "Database Initialized",
            description: "Song database has been set up successfully!",
          });
        }
        
        // Get initial recommendations
        await getRecommendations();
      } catch (error) {
        console.error('Error initializing database:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize song database. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  const getRecommendations = async () => {
    if (!includeEnglish && !includeHindi) {
      setRecommendedSongs([]);
      return;
    }

    setIsLoading(true);
    try {
      const { category, memberships } = determineSongCategory(moodParams);
      console.log('Determined category:', category, 'Memberships:', memberships);
      
      const songs = await getRecommendedSongs(
        category,
        memberships,
        6,
        includeEnglish,
        includeHindi
      );
      
      console.log('Fetched songs:', songs);
      setRecommendedSongs(songs);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get song recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update recommendations when mood params or language preferences change
  useEffect(() => {
    if (!isInitializing) {
      getRecommendations();
    }
  }, [moodParams, includeEnglish, includeHindi, isInitializing]);

  const handleSongSelect = async (song: Song) => {
    try {
      // Get similar songs for the selected song
      const similarSongs = await getSimilarSongs(song.id, 3);
      const songWithSimilar = {
        ...song,
        similarSongs: similarSongs.map(s => s.id)
      };
      setSelectedSong(songWithSimilar);
    } catch (error) {
      console.error('Error fetching similar songs:', error);
      setSelectedSong(song);
    }
  };

  const { category } = determineSongCategory(moodParams);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Initializing Music Database</h2>
          <p className="text-gray-600">Setting up your personalized music experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎵 Music Mood Generator
          </h1>
          <p className="text-lg text-gray-600">
            Discover music that matches your current vibe using AI-powered recommendations
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MoodSelector
            moodParams={moodParams}
            onMoodChange={setMoodParams}
            includeEnglish={includeEnglish}
            includeHindi={includeHindi}
            onLanguageChange={(english, hindi) => {
              setIncludeEnglish(english);
              setIncludeHindi(hindi);
            }}
          />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recommended for you: <span className="text-purple-600">{category}</span> vibes
              </h2>
              <Button 
                onClick={getRecommendations}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedSongs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onClick={() => handleSongSelect(song)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {!includeEnglish && !includeHindi 
                    ? "Please select at least one language to see recommendations."
                    : "No songs found for your current mood. Try adjusting your preferences!"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedSong && (
          <SongDetail
            song={selectedSong}
            isOpen={!!selectedSong}
            onClose={() => setSelectedSong(null)}
            similarSongs={recommendedSongs.filter(s => 
              selectedSong.similarSongs?.includes(s.id)
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
