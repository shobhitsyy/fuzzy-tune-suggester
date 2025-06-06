
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from '@/components/MoodSelector';
import { Button } from '@/components/ui/button';
import { MoodParams, determineSongCategory } from '@/utils/fuzzyLogic';
import { 
  populateDatabase, 
  isDatabasePopulated
} from '@/services/songService';
import { useToast } from '@/hooks/use-toast';

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
    
    // Navigate to recommendations page with mood parameters
    navigate('/recommendations', {
      state: {
        moodParams,
        includeEnglish,
        includeHindi
      }
    });
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
            Set your mood parameters and discover music that matches your current vibe
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MoodSelector
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

          <div className="mt-8 text-center">
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get My Recommendations 🎵
            </Button>

            <div className="mt-4 text-sm text-gray-500">
              Languages: {includeEnglish && includeHindi ? 'English & Hindi' : includeEnglish ? 'English' : includeHindi ? 'Hindi' : 'None selected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
