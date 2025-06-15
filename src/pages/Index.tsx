
import { useState, useEffect } from "react";
import MoodSelector from "@/components/MoodSelector";
import EnhancedMoodSelector from "@/components/EnhancedMoodSelector";
import UserPreferences from "@/components/UserPreferences";
import SongCard from "@/components/SongCard";
import SpotifyIntegration from "@/components/SpotifyIntegration";
import SpotifyDatabaseManager from "@/components/SpotifyDatabaseManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateMoodMemberships, type MoodInputs, type Song } from "@/utils/fuzzyLogic";
import { getRecommendedSongs, isDatabasePopulated } from "@/services/songService";
import { Music, Sparkles, Heart, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [moodInputs, setMoodInputs] = useState<MoodInputs>({
    energy: 5,
    mood: 5,
    focus: 5
  });
  const [preferences, setPreferences] = useState({
    includeEnglish: true,
    includeHindi: true
  });
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasDatabase, setHasDatabase] = useState(false);
  const { toast } = useToast();

  // Check database on component mount
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const populated = await isDatabasePopulated();
        setHasDatabase(populated);
        console.log('Database populated:', populated);
      } catch (error) {
        console.error('Error checking database:', error);
        setHasDatabase(false);
      }
    };

    checkDatabase();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      console.log('Generating recommendations with inputs:', moodInputs, preferences);

      // Calculate fuzzy logic memberships
      const memberships = calculateMoodMemberships(moodInputs);
      console.log('Calculated memberships:', memberships);

      // Find primary category (highest membership)
      const primaryCategory = Object.entries(memberships).reduce((a, b) => 
        memberships[a[0] as keyof typeof memberships] > memberships[b[0] as keyof typeof memberships] ? a : b
      )[0] as keyof typeof memberships;

      console.log('Primary category:', primaryCategory);

      // Get recommended songs
      const songs = await getRecommendedSongs(
        primaryCategory,
        memberships,
        20,
        preferences.includeEnglish,
        preferences.includeHindi
      );

      console.log('Recommendations received:', songs.length);
      setRecommendations(songs);

      if (songs.length === 0) {
        toast({
          title: "No Recommendations Found",
          description: "Try adjusting your preferences or mood settings.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Recommendations Generated!",
          description: `Found ${songs.length} songs matching your mood.`
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Music Mood Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect songs for your current mood using advanced fuzzy logic and personalized recommendations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Smart Recommendations</h3>
              <p className="text-sm text-purple-600">AI-powered mood analysis</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Personalized</h3>
              <p className="text-sm text-blue-600">Tailored to your preferences</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold text-green-800">Multi-Language</h3>
              <p className="text-sm text-green-600">English & Hindi songs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Spotify Integration</h3>
              <p className="text-sm text-orange-600">Direct playlist creation</p>
            </CardContent>
          </Card>
        </div>

        {/* Spotify Integration */}
        <SpotifyIntegration />

        {/* Database Management */}
        <SpotifyDatabaseManager />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enhanced Mood Selector */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Enhanced Mood Selection
                </CardTitle>
                <CardDescription>
                  Use our advanced mood selector for precise recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMoodSelector 
                  onMoodChange={setMoodInputs}
                  currentMood={moodInputs}
                />
              </CardContent>
            </Card>

            {/* Basic Mood Selector */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Quick Mood Selector</CardTitle>
                <CardDescription>
                  Simple sliders for energy, mood, and focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodSelector 
                  onMoodChange={setMoodInputs}
                  currentMood={moodInputs}
                />
              </CardContent>
            </Card>

            {/* User Preferences */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
                <CardDescription>
                  Customize your music recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserPreferences 
                  onPreferencesChange={setPreferences}
                  currentPreferences={preferences}
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={generateRecommendations}
              disabled={loading || !hasDatabase}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Magic...
                </div>
              ) : !hasDatabase ? (
                "Database Loading..."
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Recommendations
                </div>
              )}
            </Button>

            {!hasDatabase && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Database Status:</strong> Checking song database... If this persists, try using the Spotify Database Manager above to add songs.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-600" />
                  Your Music Recommendations
                  {recommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {recommendations.length} songs
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Songs perfectly matched to your current mood and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Music className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700">Ready to Find Your Perfect Songs?</h3>
                    <p className="text-gray-500">
                      Set your mood and preferences, then click "Generate Recommendations" to discover music that matches your vibe.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((song) => (
                      <SongCard key={song.id} song={song} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
