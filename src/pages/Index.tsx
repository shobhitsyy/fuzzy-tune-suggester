
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";
import AnimatedBackground from "@/components/AnimatedBackground";
import MoodMelodyHeader from "@/components/MoodMelodyHeader";
import PageFooter from "@/components/PageFooter";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState({
    energy: 5,
    mood: 5,
    focus: 5,
  });
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <AnimatedBackground />
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 space-y-2 sm:space-y-4">
          <MoodMelodyHeader />
          <p className="text-md sm:text-lg md:text-xl text-neutral-600 max-w-xl mx-auto leading-relaxed mt-2">
            Discover music that perfectly matches your current vibe. Set your mood and let AI curate the perfect playlist for you.
          </p>
        </div>
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
                      maxSongs: 40,
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
                  <Sparkles className="h-6 w-6" />
                  <span>Get My Recommendations</span>
                  <Sparkles className="h-6 w-6" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
        <PageFooter />
      </main>
    </div>
  );
};

export default Index;
