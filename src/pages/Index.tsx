
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { spotifyDatabaseService } from "@/services/spotifyDatabaseService";

// Import EnhancedMoodSelector directly here for the mood/energy/focus controls
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
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- Auto-ingest curated songs on first mount ---
  useEffect(() => {
    // Add curated (5 eng + 5 hindi) songs on first load, auto and quietly (no toasts).
    spotifyDatabaseService.addCuratedSongsToDatabase().then(res => {
      if (res?.added > 0) {
        // Optionally, you can show a subtle toast for admins, but we'll skip for clean UI.
        // toast({ title: "Songs updated", description: `${res.added} curated songs now in database.` });
      }
    });
  }, []);

  // Subtle background-image and color for visual appeal
  // Centered, mobile-first container and gradient overlay
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f7e8ff] via-[#eff8ff] to-[#c7d1ee] px-2 py-6 relative overflow-hidden">
      
      {/* Large floating music wave/artistic background for uniqueness */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-24 sm:-left-40 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-purple-300/40 to-blue-100 blur-2xl rounded-full z-0 animate-fade-in"></div>
        <div className="absolute bottom-8 right-8 w-40 h-40 sm:w-80 sm:h-80 bg-purple-200/40 rounded-t-full blur-2xl rotate-12"></div>
      </div>
      
      <main className="w-full max-w-md mx-auto flex flex-col gap-8 z-10">
        {/* LOGO and Title */}
        <div className="w-full flex justify-center mt-2 mb-3">
          <div className="flex items-center gap-2">
            <Music className="h-10 w-10 text-purple-700 animate-fade-in" />
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-blue-900 to-blue-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight select-none">
              Mood Melody
            </span>
          </div>
        </div>
        
        {/* Card with mood selector */}
        <Card className="bg-white/95 border-none shadow-xl rounded-3xl p-0">
          <CardHeader className="p-6 pb-2 flex flex-row items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <CardTitle className="text-lg sm:text-xl font-semibold text-blue-900">
              Set Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 pb-5 px-7 flex flex-col gap-4 items-stretch">
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
                }, 600);
              }}
              disabled={loading}
              className="w-full mt-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 text-md rounded-xl shadow hover:scale-105 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get Recommendations
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-2 text-xs mt-2 opacity-60 animate-fade-in">
          <span>
            Powered by Spotify & Supabase | AI Mood Engine
          </span>
        </div>
      </main>
    </div>
  );
};

export default Index;

