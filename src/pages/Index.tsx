
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedMoodSelector from '@/components/EnhancedMoodSelector';
import SongCard from '@/components/SongCard';
import SongDetail from '@/components/SongDetail';
import { Song, MoodParams, determineSongCategory } from '@/utils/fuzzyLogic';
import { populateDatabase, isDatabasePopulated, getRecommendedSongs } from '@/services/songService';
import { Music, Sparkles, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserPreferencesType {
  defaultLanguage: 'English' | 'Hindi' | 'both';
  recommendationCount: number;
  favoriteGenres: string[];
  excludedGenres: string[];
  discoveryMode: 'balanced' | 'adventurous' | 'safe';
  spotifyRedirect: boolean;
  sensitivity: number;
  privateMode?: boolean;
}

const Index = () => {
  const [currentMood, setCurrentMood] = useState<MoodParams>({
    heartRate: 70,
    timeOfDay: 12,
    activity: 5,
    mood: 5
  });
  
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    defaultLanguage: 'both' as 'English' | 'Hindi' | 'both',
    recommendationCount: 20,
    favoriteGenres: [] as string[],
    excludedGenres: [] as string[],
    discoveryMode: 'balanced' as 'balanced' | 'adventurous' | 'safe',
    spotifyRedirect: true,
    sensitivity: 5,
    privateMode: false
  });
  
  const { toast } = useToast();

  useEffect(() => {
    initializeDatabase();
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('musicPreferences');
    if (saved) {
      const parsedPrefs = JSON.parse(saved);
      setPreferences(parsedPrefs);
      
      // Update language preferences
      if (parsedPrefs.defaultLanguage === 'English') {
        setIncludeEnglish(true);
        setIncludeHindi(false);
      } else if (parsedPrefs.defaultLanguage === 'Hindi') {
        setIncludeEnglish(false);
        setIncludeHindi(true);
      } else {
        setIncludeEnglish(true);
        setIncludeHindi(true);
      }
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
        // Automatically switch to recommendations tab
        setActiveTab('recommendations');
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

  const handleLanguageChange = (english: boolean, hindi: boolean) => {
    setIncludeEnglish(english);
    setIncludeHindi(hindi);
    
    // Update preferences
    const newLanguage = english && hindi ? 'both' : english ? 'English' : 'Hindi';
    const updatedPrefs = { ...preferences, defaultLanguage: newLanguage as 'English' | 'Hindi' | 'both' };
    setPreferences(updatedPrefs);
    localStorage.setItem('musicPreferences', JSON.stringify(updatedPrefs));
  };

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 md:mb-4">
            MoodTunes
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Discover music that perfectly matches your mood. Get personalized recommendations and explore new songs on Spotify.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 bg-card/50 backdrop-blur-sm border border-border">
            <TabsTrigger value="discover" className="flex items-center gap-2 text-sm md:text-base">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2 text-sm md:text-base">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Your Music</span>
              <span className="sm:hidden">Music</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6 md:space-y-8">
            <Card className="glass-card shadow-xl">
              <CardHeader className="text-center pb-4 md:pb-6">
                <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <EnhancedMoodSelector
                  moodParams={currentMood}
                  onMoodChange={setCurrentMood}
                  includeEnglish={includeEnglish}
                  includeHindi={includeHindi}
                  onLanguageChange={handleLanguageChange}
                />
                <div className="text-center mt-6 md:mt-8">
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !dbInitialized}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-primary-foreground mr-2"></div>
                        <span className="text-sm md:text-base">Finding Your Perfect Songs...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        <span className="text-sm md:text-base">Get My Recommendations ({preferences.recommendationCount} songs)</span>
                      </>
                    )}
                  </Button>
                  {!dbInitialized && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">
                      Initializing song database...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 md:space-y-6">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-foreground text-lg md:text-xl">
                  <Sparkles className="h-5 w-5" />
                  Your Personalized Recommendations ({recommendedSongs.length} songs)
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                {recommendedSongs.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <Music className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                      Set your mood and get personalized song recommendations that you can play on Spotify
                    </p>
                    <Button
                      onClick={() => handleTabClick('discover')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Start Discovering Music
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {recommendedSongs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onClick={handleSongSelect}
                        onFeedback={handleSongFeedback}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

export default Index;
