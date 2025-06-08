
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedMoodSelector from '@/components/EnhancedMoodSelector';
import UserPreferences from '@/components/UserPreferences';
import SongFeedback from '@/components/SongFeedback';
import { Song, MoodParams, determineSongCategory } from '@/utils/fuzzyLogic';
import { populateDatabase, isDatabasePopulated, getRecommendedSongs } from '@/services/songService';
import { Music, Sparkles, Heart, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentMood, setCurrentMood] = useState<MoodParams>({
    energy: 5,
    valence: 5,
    arousal: 5,
    focus: 5,
    social: 5
  });
  
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultLanguage: 'both' as 'English' | 'Hindi' | 'both',
    recommendationCount: 20,
    favoriteGenres: [] as string[],
    excludedGenres: [] as string[]
  });
  
  const { toast } = useToast();

  useEffect(() => {
    initializeDatabase();
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('musicPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const initializeDatabase = async () => {
    try {
      console.log('Checking database initialization...');
      const isPopulated = await isDatabasePopulated();
      
      if (!isPopulated) {
        console.log('Database not populated, initializing...');
        await populateDatabase();
        toast({
          title: "Database Initialized",
          description: "Song database has been set up successfully!",
        });
      }
      
      setDbInitialized(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize the song database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetRecommendations = async () => {
    if (!dbInitialized) {
      toast({
        title: "Database Not Ready",
        description: "Please wait for the database to initialize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { category, memberships } = determineSongCategory(currentMood);
      console.log('Getting recommendations for category:', category, 'with memberships:', memberships);
      
      const includeEnglish = preferences.defaultLanguage === 'English' || preferences.defaultLanguage === 'both';
      const includeHindi = preferences.defaultLanguage === 'Hindi' || preferences.defaultLanguage === 'both';
      
      const songs = await getRecommendedSongs(
        category, 
        memberships, 
        preferences.recommendationCount,
        includeEnglish,
        includeHindi
      );
      
      console.log('Received recommended songs:', songs.length);
      setRecommendedSongs(songs);
      
      // Save to listening history if not in private mode
      if (!preferences.privateMode) {
        const history = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
        const newHistory = [...songs.slice(0, 5), ...history].slice(0, 100); // Keep last 100
        localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
      }
      
      if (songs.length === 0) {
        toast({
          title: "No Recommendations Found",
          description: "Try adjusting your mood settings or language preferences.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Recommendations Ready!",
          description: `Found ${songs.length} songs matching your mood. Check them out on Spotify!`,
        });
      }
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

  const handleSongFeedback = (songId: string, rating: 'like' | 'dislike' | 'love', feedback?: string) => {
    console.log('Song feedback:', { songId, rating, feedback });
    
    // Update user preferences based on feedback
    const song = recommendedSongs.find(s => s.id === songId);
    if (song && rating === 'love') {
      const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
      const updatedFavorites = [...favorites, song].slice(0, 50); // Keep last 50
      localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
    }
  };

  const handlePreferencesChange = (newPreferences: any) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            MoodTunes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover music that perfectly matches your mood. Get personalized recommendations and explore new songs on Spotify.
          </p>
        </div>

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="discover" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Music className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Sparkles className="h-4 w-4" />
              Your Music
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedMoodSelector
                  onMoodChange={setCurrentMood}
                  currentMood={currentMood}
                />
                <div className="text-center mt-8">
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !dbInitialized}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Finding Your Perfect Songs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Get My Recommendations ({preferences.recommendationCount} songs)
                      </>
                    )}
                  </Button>
                  {!dbInitialized && (
                    <p className="text-sm text-gray-500 mt-2">
                      Initializing song database...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Sparkles className="h-5 w-5" />
                  Your Personalized Recommendations ({recommendedSongs.length} songs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedSongs.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Set your mood and get personalized song recommendations that you can play on Spotify
                    </p>
                    <Button
                      onClick={() => document.querySelector('[value="discover"]')?.click()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Start Discovering Music
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {recommendedSongs.map((song) => (
                      <SongFeedback
                        key={song.id}
                        song={song}
                        onFeedback={handleSongFeedback}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                  <Settings className="h-5 w-5" />
                  Your Music Preferences & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserPreferences onPreferencesChange={handlePreferencesChange} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
