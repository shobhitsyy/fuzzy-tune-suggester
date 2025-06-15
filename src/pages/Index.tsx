import { useState, useEffect } from "react";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";
import SongCard from "@/components/SongCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateMoodMemberships, type MoodInputs, type Song, type SongCategoryType } from "@/utils/fuzzyLogic";
import { getRecommendedSongs, isDatabasePopulated } from "@/services/songService";
import { Music, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { spotifyDatabaseService } from "@/services/spotifyDatabaseService";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState<MoodInputs>({
    energy: 5,
    mood: 5,
    focus: 5
  });
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasDatabase, setHasDatabase] = useState(false);
  const { toast } = useToast();

  // Populate DB automatically on first visit
  useEffect(() => {
    const populateDB = async () => {
      try {
        await spotifyDatabaseService.addCuratedSongsToDatabase();
        const populated = await isDatabasePopulated();
        setHasDatabase(populated);
      } catch (error) {
        setHasDatabase(false);
      }
    };
    populateDB();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const memberships = calculateMoodMemberships(moodInputs);
      const primaryCategory = Object.entries(memberships).reduce((a, b) =>
        memberships[a[0] as SongCategoryType] > memberships[b[0] as SongCategoryType] ? a : b
      )[0] as SongCategoryType;

      const songs = await getRecommendedSongs(
        primaryCategory,
        memberships,
        20,
        true,
        true
      );
      setRecommendations(songs);

      if (songs.length === 0) {
        toast({
          title: "No Recommendations Found",
          description: "Try adjusting your mood settings.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Recommendations Generated!",
          description: `Found ${songs.length} songs matching your mood.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="flex-1 w-full max-w-xl mx-auto px-2 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Music Mood Generator
          </h1>
        </div>
        <Card className="bg-white/90 border-none shadow-md p-0 rounded-2xl">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Set Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <EnhancedMoodSelector 
              moodInputs={moodInputs}
              onMoodChange={setMoodInputs}
              includeEnglish={true}
              includeHindi={true}
              onLanguageChange={() => {}}
            />
          </CardContent>
        </Card>
        <Button 
          onClick={generateRecommendations}
          disabled={loading || !hasDatabase}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 text-lg rounded-xl shadow hover:scale-105 transition"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </div>
          ) : !hasDatabase ? (
            "Preparing Database..."
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Get Recommendations
            </div>
          )}
        </Button>
        <div className="flex-1">
          <Card className="bg-white/90 border-none shadow p-0 rounded-2xl">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-blue-600" />
                Your Recommendations
                {recommendations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {recommendations.length} songs
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">No songs yet</h3>
                  <p className="text-gray-500 text-sm">
                    Adjust your mood and try getting some music!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {recommendations.map((song) => (
                    <SongCard key={song.id} song={song} onClick={() => {}} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
