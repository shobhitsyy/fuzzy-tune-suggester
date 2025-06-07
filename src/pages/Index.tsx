
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedMoodSelector from '@/components/EnhancedMoodSelector';
import UserPreferences, { UserPreferences as UserPrefsType } from '@/components/UserPreferences';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodParams, determineSongCategory } from '@/utils/fuzzyLogic';
import { 
  populateDatabase, 
  isDatabasePopulated
} from '@/services/songService';
import { useToast } from '@/hooks/use-toast';
import { Music, User, TrendingUp, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [moodParams, setMoodParams] = useState<MoodParams>({
    heartRate: 75,
    timeOfDay: new Date().getHours(),
    activity: 5,
    mood: 5
  });

  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPrefsType | null>(null);
  const { toast } = useToast();

  // Initialize database on component mount
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Starting database initialization...');
        setIsInitializing(true);
        setInitializationError(null);
        
        const isPopulated = await isDatabasePopulated();
        console.log('Database populated status:', isPopulated);
        
        if (!isPopulated) {
          console.log('Database not populated, initializing...');
          await populateDatabase();
          console.log('Database population completed');
          
          toast({
            title: "Database Initialized",
            description: "Song database has been set up successfully!",
          });
        } else {
          console.log('Database already populated');
        }
        
      } catch (error) {
        console.error('Error initializing database:', error);
        setInitializationError('Failed to initialize the music database. Please refresh the page to try again.');
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
  }, [toast]);

  const handleGetRecommendations = () => {
    if (!includeEnglish && !includeHindi) {
      toast({
        title: "Language Required",
        description: "Please select at least one language to get recommendations.",
        variant: "destructive",
      });
      return;
    }

    const { category } = determineSongCategory(moodParams);
    console.log('Getting recommendations for category:', category);
    
    // Save to history
    const historyEntry = {
      moodParams,
      includeEnglish,
      includeHindi,
      timestamp: new Date().toISOString(),
      category
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('musicMoodSearchHistory') || '[]');
    existingHistory.unshift(historyEntry);
    localStorage.setItem('musicMoodSearchHistory', JSON.stringify(existingHistory.slice(0, 50))); // Keep last 50 searches
    
    // Navigate to recommendations page with mood parameters
    navigate('/recommendations', {
      state: {
        moodParams,
        includeEnglish,
        includeHindi,
        userPreferences
      }
    });
  };

  const handlePreferencesChange = (preferences: UserPrefsType) => {
    setUserPreferences(preferences);
    // Auto-adjust language preferences based on user settings
    if (preferences.preferredLanguages.length > 0) {
      setIncludeEnglish(preferences.preferredLanguages.includes('English'));
      setIncludeHindi(preferences.preferredLanguages.includes('Hindi'));
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
          <div className="mt-4 text-sm text-gray-500">
            <p>🎵 Loading song library</p>
            <p>🔗 Setting up recommendations</p>
            <p>⚡ Preparing smart features</p>
          </div>
        </div>
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Database Error</h2>
          <p className="text-gray-600 mb-4">{initializationError}</p>
          <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
            Refresh Page
          </Button>
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
            Discover music that perfectly matches your current vibe with AI-powered recommendations
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>Smart Matching</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center space-x-1">
              <Music className="h-4 w-4" />
              <span>100+ Songs</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="mood" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mood" className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>Mood Settings</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mood" className="space-y-6">
              <EnhancedMoodSelector
                moodParams={moodParams}
                onMoodChange={setMoodParams}
                includeEnglish={includeEnglish}
                includeHindi={includeHindi}
                onLanguageChange={(english, hindi) => {
                  console.log('Language preferences changed:', { english, hindi });
                  setIncludeEnglish(english);
                  setIncludeHindi(hindi);
                }}
              />

              <div className="text-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Ready for <span className="text-purple-600">{category}</span> vibes?
                  </h2>
                  <p className="text-gray-600">
                    Click below to discover songs perfectly matched to your current mood
                  </p>
                </div>

                <Button 
                  onClick={handleGetRecommendations}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Music className="h-5 w-5 mr-2" />
                  Get My Recommendations 🎵
                </Button>

                <div className="mt-4 text-sm text-gray-500">
                  Languages: {includeEnglish && includeHindi ? 'English & Hindi' : 
                             includeEnglish ? 'English Only' : 
                             includeHindi ? 'Hindi Only' : 'None Selected'}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <UserPreferences onPreferencesChange={handlePreferencesChange} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
