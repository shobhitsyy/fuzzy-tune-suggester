import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heart, Activity, Music, Info } from 'lucide-react';
import { calculateMembership, SongCategory, Song } from '@/utils/fuzzyLogic';
import SongCard from '@/components/SongCard';
import SongDetailsDialog from '@/components/SongDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { getRecommendedSongs, isDatabasePopulated, populateDatabase } from '@/services/songService';
import SpotifyIntegration from '@/components/SpotifyIntegration';
import SpotifyFeatures from '@/components/SpotifyFeatures';
import SpotifyDatabaseManager from '@/components/SpotifyDatabaseManager';

const Index = () => {
  const [heartRate, setHeartRate] = useState<number>(70);
  const [activity, setActivity] = useState<number>(5);
  const [mood, setMood] = useState<number>(5);
  const [includeEnglish, setIncludeEnglish] = useState<boolean>(true);
  const [includeHindi, setIncludeHindi] = useState<boolean>(true);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDbInitialized, setIsDbInitialized] = useState<boolean>(false);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const isPopulated = await isDatabasePopulated();
        setIsDbInitialized(isPopulated);
        setIsDbLoading(false);
      } catch (error) {
        console.error('Error checking database:', error);
        setIsDbLoading(false);
      }
    };

    checkDatabase();
  }, []);

  const handleInitializeDatabase = async () => {
    setIsDbLoading(true);
    try {
      await populateDatabase();
      setIsDbInitialized(true);
      toast({
        title: "Database Initialized",
        description: "Song database has been successfully populated.",
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize the song database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!includeEnglish && !includeHindi) {
      toast({
        title: "Language Selection Required",
        description: "Please select at least one language for recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendedSongs([]);

    try {
      // Calculate fuzzy memberships based on user inputs
      const memberships = calculateMembership(heartRate, activity, mood);
      
      // Find the primary category (highest membership value)
      let primaryCategory: SongCategory = 'happy';
      let maxMembership = 0;
      
      Object.entries(memberships).forEach(([category, value]) => {
        if (value > maxMembership) {
          maxMembership = value;
          primaryCategory = category as SongCategory;
        }
      });

      // Get recommended songs
      const songs = await getRecommendedSongs(
        primaryCategory,
        memberships,
        20,
        includeEnglish,
        includeHindi
      );

      setRecommendedSongs(songs);
      
      if (songs.length === 0) {
        toast({
          title: "No Songs Found",
          description: "Try adjusting your mood parameters or language preferences.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Recommendations Ready",
          description: `Found ${songs.length} songs matching your mood.`,
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: "Failed to generate song recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
  };

  const handleCloseDialog = () => {
    setSelectedSong(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Music Mood Generator</h1>
          <p className="text-gray-600">Discover songs that match your current mood and activity level</p>
        </div>

        {/* Spotify Integration */}
        <div className="mb-8">
          <SpotifyIntegration onAuthSuccess={() => {
            console.log('Spotify authenticated successfully');
          }} />
        </div>

        {/* Spotify Database Management */}
        <div className="mb-8">
          <SpotifyDatabaseManager />
        </div>

        {/* User Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Heart Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Heart className="h-5 w-5 text-rose-600" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">BPM</span>
                  <span className="text-2xl font-bold text-rose-600">{heartRate}</span>
                </div>
                <Slider
                  value={[heartRate]}
                  min={50}
                  max={180}
                  step={1}
                  onValueChange={(value) => setHeartRate(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Resting (50)</span>
                  <span>Moderate (110)</span>
                  <span>Intense (180)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Level */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Activity className="h-5 w-5 text-blue-600" />
                Activity Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Level</span>
                  <span className="text-2xl font-bold text-blue-600">{activity}/10</span>
                </div>
                <Slider
                  value={[activity]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setActivity(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Relaxed (1)</span>
                  <span>Moderate (5)</span>
                  <span>Energetic (10)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mood */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Music className="h-5 w-5 text-amber-600" />
                Current Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mood</span>
                  <span className="text-2xl font-bold text-amber-600">{mood}/10</span>
                </div>
                <Slider
                  value={[mood]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setMood(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sad (1)</span>
                  <span>Neutral (5)</span>
                  <span>Happy (10)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Preferences */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800">Language Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="english"
                  checked={includeEnglish}
                  onCheckedChange={setIncludeEnglish}
                />
                <Label htmlFor="english">English Songs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hindi"
                  checked={includeHindi}
                  onCheckedChange={setIncludeHindi}
                />
                <Label htmlFor="hindi">Hindi Songs</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          {!isDbInitialized && !isDbLoading ? (
            <Button 
              onClick={handleInitializeDatabase} 
              disabled={isDbLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              {isDbLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Initializing Database...</span>
                </div>
              ) : (
                <span>Initialize Song Database</span>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleGenerateRecommendations} 
              disabled={isLoading || isDbLoading || (!includeEnglish && !includeHindi)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <span>Generate Music Recommendations</span>
              )}
            </Button>
          )}
        </div>

        {/* Spotify Features */}
        {recommendedSongs.length > 0 && (
          <div className="mb-8">
            <SpotifyFeatures 
              recommendedSongs={recommendedSongs}
              currentMood={{ heartRate, activity, mood }}
            />
          </div>
        )}

        {/* Results */}
        {recommendedSongs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Recommendations</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Click on a song to see details</span>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Songs</TabsTrigger>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="hindi">Hindi</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendedSongs.map((song) => (
                    <SongCard key={song.id} song={song} onClick={handleSongClick} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="english">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendedSongs
                    .filter((song) => song.language === 'English')
                    .map((song) => (
                      <SongCard key={song.id} song={song} onClick={handleSongClick} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hindi">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendedSongs
                    .filter((song) => song.language === 'Hindi')
                    .map((song) => (
                      <SongCard key={song.id} song={song} onClick={handleSongClick} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Song Details Dialog */}
        {selectedSong && (
          <SongDetailsDialog song={selectedSong} open={!!selectedSong} onClose={handleCloseDialog} />
        )}
      </div>
    </div>
  );
};

export default Index;
