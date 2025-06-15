
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Music, Heart, Zap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { spotifyDatabaseService } from "@/services/spotifyDatabaseService";
import { supabase } from "@/integrations/supabase/client";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState({
    energy: 5,
    mood: 5,
    focus: 5
  });
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [dbStats, setDbStats] = useState({ count: 0, loading: true });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check database stats
  useEffect(() => {
    const checkDatabaseStats = async () => {
      try {
        const { count, error } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true });

        if (!error) {
          setDbStats({ count: count || 0, loading: false });
          console.log('Current database song count:', count);
        }
      } catch (error) {
        console.error('Error checking database stats:', error);
        setDbStats({ count: 0, loading: false });
      }
    };

    checkDatabaseStats();
  }, []);

  // Populate curated songs to DB whenever you want (no constraint)
  const handlePopulateSongs = async () => {
    setIsPopulating(true);
    try {
      console.log('Starting song population...');

      // Reset any previous population flags by clearing localStorage
      localStorage.removeItem('songsPopulated');

      const results = await spotifyDatabaseService.addCuratedSongsToDatabase();
      console.log('Song population results:', results);

      if (results?.added > 0) {
        toast({
          title: "🎵 Music Library Updated",
          description: `Added ${results.added} new songs to your collection!`,
        });

        // Update stats
        setDbStats(prev => ({ ...prev, count: prev.count + results.added }));
      } else if (results?.errors > 0) {
        toast({
          title: "⚠️ Database Update Issues",
          description: `Encountered ${results.errors} errors while adding songs. Check console for details.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No New Songs Added",
          description: "No new songs were added to your library.",
        });
      }
    } catch (error) {
      console.error('Failed to populate songs:', error);
      toast({
        title: "❌ Database Update Failed",
        description: "Failed to update music library. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating music notes */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse text-purple-400">♪</div>
        <div className="absolute top-40 right-16 text-4xl opacity-15 animate-bounce text-pink-400">♫</div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-12 animate-pulse text-blue-400">♬</div>

        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Music className="h-12 w-12 text-purple-600 animate-pulse" />
              <Heart className="h-6 w-6 text-pink-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Mood Melody
            </h1>
            {/* Discovery Button */}
            <Button
              variant="secondary"
              size="sm"
              className="ml-3 flex items-center gap-1"
              onClick={() => navigate("/discovery")}
            >
              <Search className="h-4 w-4" />
              Discovery
            </Button>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover music that perfectly matches your current vibe. Set your mood and let AI curate the perfect playlist for you.
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-bold">
              <Zap className="h-8 w-8" />
              Set Your Mood
            </CardTitle>
            <p className="text-purple-100 mt-2">
              Tell us how you're feeling and we'll find the perfect songs for you
            </p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <EnhancedMoodSelector
              moodInputs={moodInputs}
              onMoodChange={setMoodInputs}
              includeEnglish={includeEnglish}
              includeHindi={includeHindi}
              onLanguageChange={(eng, hin) => {
                setIncludeEnglish(eng);
                setIncludeHindi(hin);
              }}
            />

            <Button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  navigate("/recommendations", {
                    state: {
                      moodParams: { ...moodInputs },
                      includeEnglish,
                      includeHindi,
                      maxSongs: 20,
                    }
                  });
                }, 800);
              }}
              disabled={loading || isPopulating}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Creating Your Playlist...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  <span>Get My Recommendations</span>
                  <Sparkles className="h-6 w-6" />
                </div>
              )}
            </Button>
            {/* Removed Update Song Database button */}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center space-y-2 opacity-70">
          <p className="text-sm text-gray-500">
            Powered by Spotify API & Advanced AI Mood Analysis
          </p>
          {/* Removed Personalized Music Discovery text */}
        </div>
      </main>
    </div>
  );
};

export default Index;
