
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";
import SeedSongs from "./SeedSongs";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState({
    energy: 5,
    mood: 5,
    focus: 5
  });
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dbStats, setDbStats] = useState({ count: 0, loading: true });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDatabaseStats = async () => {
      try {
        const { count, error } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true });

        if (!error) {
          setDbStats({ count: count || 0, loading: false });
        }
      } catch (error) {
        setDbStats({ count: 0, loading: false });
      }
    };

    checkDatabaseStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-8 text-7xl font-bold opacity-10 text-purple-400">♪</div>
        <div className="absolute top-40 right-16 text-5xl opacity-15 text-pink-400">♫</div>
        <div className="absolute bottom-24 left-20 text-6xl opacity-12 text-blue-400">♬</div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
      </div>
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 justify-center">
              <Music className="h-12 w-12 text-purple-600" />
              <span className="text-[2.7rem] md:text-6xl font-extrabold" style={{
                background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0px 2px 16px rgba(170,85,247,0.12)"
              }}>
                Mood 
              </span>
              <span className="text-[2.7rem] md:text-6xl font-extrabold text-transparent bg-clip-text" style={{
                color: "#6366f1",
                textShadow: "0px 1px 6px #f9a8d4"
              }}>Melody</span>
              <Heart className="h-7 w-7 text-pink-500 -ml-3 animate-bounce" />
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover music that perfectly matches your current vibe.<br />
              Set your mood and let AI curate the perfect playlist for you.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Music className="h-4 w-4 text-purple-400" />
              <span>{dbStats.count} songs in library</span>
            </div>
          </div>
        </div>
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-bold">
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
                      maxSongs: 300, // send a high value to not restrict
                    }
                  });
                }, 800);
              }}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Creating Your Playlist...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>Get My Recommendations</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
        <SeedSongs />
        <div className="mt-12 text-center space-y-2 opacity-70">
          <p className="text-sm text-gray-500">
            Powered by Spotify API & Advanced AI Mood Analysis
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>✨</span>
            <span>Personalized Music Discovery</span>
            <span>✨</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
