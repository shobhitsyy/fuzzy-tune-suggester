
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
    recommendationCount: 25,
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

  // Calculate dynamic recommendation count based on mood and available songs
  const getDynamicRecommendationCount = (category: any, memberships: any) => {
    const baseCount = 20; // Minimum count
    const maxCount = 50; // Maximum count
    
    // Calculate based on mood intensity - higher energy/valence = more songs
    const moodIntensity = (currentMood.activity + currentMood.mood) / 10;
    const dynamicCount = Math.round(baseCount + (moodIntensity * 15));
    
    return Math.min(Math.max(dynamicCount, baseCount), maxCount);
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
      const dynamicCount = getDynamicRecommendationCount(category, memberships);
      
      console.log('Getting recommendations for category:', category, 'with memberships:', memberships);
      console.log('Dynamic recommendation count:', dynamicCount);
      
      const songs = await getRecommendedSongs(
        category, 
        memberships, 
        dynamicCount,
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

  const getDynamicSongCount = () => {
    if (recommendedSongs.length === 0) return "20+ songs";
    return `${recommendedSongs.length} songs`;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 md:mb-8 px-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 md:mb-4 leading-tight">
            MoodTunes
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover music that perfectly matches your mood. Get personalized recommendations and explore new songs on Spotify.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 md:mb-8 bg-card/50 backdrop-blur-sm border border-border h-12 sm:h-14">
            <TabsTrigger value="discover" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base py-2 sm:py-3">
              <Music className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base py-2 sm:py-3">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Your Music</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-4 sm:space-y-6 md:space-y-8">
            <Card className="glass-card shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-2 leading-tight">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500 flex-shrink-0" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-6 sm:pb-8">
                <EnhancedMoodSelector
                  moodParams={currentMood}
                  onMoodChange={setCurrentMood}
                  includeEnglish={includeEnglish}
                  includeHindi={includeHindi}
                  onLanguageChange={handleLanguageChange}
                />
                <div className="text-center mt-6 sm:mt-8">
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !dbInitialized}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base min-h-[48px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-primary-foreground"></div>
                        <span className="text-xs sm:text-sm md:text-base">Finding Your Perfect Songs...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base">Get My Recommendations ({getDynamicSongCount()})</span>
                      </div>
                    )}
                  </Button>
                  {!dbInitialized && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 px-4">
                      Initializing song database...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 sm:space-y-6">
            <Card className="glass-card shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg md:text-xl">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Your Personalized Recommendations ({recommendedSongs.length} songs)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
                {recommendedSongs.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <Music className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      Set your mood and get personalized song recommendations that you can play on Spotify
                    </p>
                    <Button
                      onClick={() => handleTabClick('discover')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-sm sm:text-base min-h-[44px]"
                    >
                      Start Discovering Music
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
