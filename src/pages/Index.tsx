import { useState, useEffect } from "react";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateMoodMemberships, type MoodInputs, type SongCategoryType } from "@/utils/fuzzyLogic";
import { useNavigate } from "react-router-dom";
import { Music, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { spotifyDatabaseService } from "@/services/spotifyDatabaseService";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState<MoodInputs>({
    energy: 5,
    mood: 5,
    focus: 5
  });
  const [includeEnglish, setIncludeEnglish] = useState(true);
  const [includeHindi, setIncludeHindi] = useState(true);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Populate DB automatically on first visit (and keep UI clean)
  useEffect(() => {
    // Fire and forget - user doesn't see this
    spotifyDatabaseService.addCuratedSongsToDatabase().catch(() => {});
  }, []);

  // Use a visually appealing, centered card with only mood/energy/focus/and language pickers
  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/recommendations", {
        state: {
          moodParams: { ...moodInputs },
          includeEnglish,
          includeHindi,
        }
      });
    }, 700); // Give tiny pause for perceived loading
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 pt-8 pb-8">
      <div className="w-full max-w-md px-2 flex flex-col gap-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Music className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Music Mood Generator
          </h1>
        </div>
        <Card className="bg-white/90 border-none shadow-lg p-0 rounded-3xl">
          <CardHeader className="p-5">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-gray-900">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Set Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
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
          </CardContent>
        </Card>
        <Button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 text-lg rounded-xl shadow hover:scale-105 transition"
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
      </div>
    </div>
  );
};

export default Index;
