
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Heart, 
  TrendingUp, 
  Music, 
  Globe, 
  Headphones,
  Calendar,
  BarChart3,
  Settings,
  Star,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Song } from '@/utils/fuzzyLogic';
import { useToast } from '@/hooks/use-toast';

interface UserPreferencesProps {
  onPreferencesChange?: (preferences: any) => void;
}

const UserPreferences = ({ onPreferencesChange }: UserPreferencesProps) => {
  const [preferences, setPreferences] = useState({
    defaultLanguage: 'both' as 'English' | 'Hindi' | 'both',
    autoPlay: false,
    showLyrics: true,
    recommendationCount: 20,
    favoriteGenres: [] as string[],
    excludedGenres: [] as string[],
    moodSensitivity: [7],
    enableNotifications: true,
    privateMode: false
  });

  const [listeningHistory, setListeningHistory] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState({
    totalSongsDiscovered: 0,
    favoriteGenre: '',
    listeningStreak: 0,
    totalListeningTime: 0
  });

  const { toast } = useToast();

  const genres = [
    'Bollywood', 'Classical', 'Rock', 'Pop', 'Jazz', 'Electronic', 
    'Folk', 'Hip Hop', 'Indie', 'Blues', 'Country', 'R&B'
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Load from localStorage
    const savedPrefs = localStorage.getItem('musicPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }

    const history = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
    setListeningHistory(history.slice(0, 50)); // Show last 50 songs

    const favorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
    setFavoriteSongs(favorites);

    // Calculate stats
    const feedback = JSON.parse(localStorage.getItem('songFeedback') || '{}');
    const totalSongs = Object.keys(feedback).length;
    const genreCounts: Record<string, number> = {};
    
    Object.values(feedback).forEach((item: any) => {
      if (item.song?.tags) {
        item.song.tags.forEach((tag: string) => {
          genreCounts[tag] = (genreCounts[tag] || 0) + 1;
        });
      }
    });

    const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    
    setStats({
      totalSongsDiscovered: totalSongs,
      favoriteGenre,
      listeningStreak: Math.floor(Math.random() * 30) + 1, // Simulated
      totalListeningTime: Math.floor(Math.random() * 500) + 100 // Simulated in hours
    });
  };

  const savePreferences = (newPrefs: typeof preferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('musicPreferences', JSON.stringify(newPrefs));
    onPreferencesChange?.(newPrefs);
    
    toast({
      title: "Preferences Saved",
      description: "Your music preferences have been updated successfully.",
    });
  };

  const toggleGenre = (genre: string, type: 'favorite' | 'excluded') => {
    const newPrefs = { ...preferences };
    
    if (type === 'favorite') {
      newPrefs.favoriteGenres = newPrefs.favoriteGenres.includes(genre)
        ? newPrefs.favoriteGenres.filter(g => g !== genre)
        : [...newPrefs.favoriteGenres, genre];
    } else {
      newPrefs.excludedGenres = newPrefs.excludedGenres.includes(genre)
        ? newPrefs.excludedGenres.filter(g => g !== genre)
        : [...newPrefs.excludedGenres, genre];
    }
    
    savePreferences(newPrefs);
  };

  const clearHistory = () => {
    localStorage.removeItem('listeningHistory');
    setListeningHistory([]);
    toast({
      title: "History Cleared",
      description: "Your listening history has been cleared.",
    });
  };

  const exportData = () => {
    const data = {
      preferences,
      listeningHistory,
      favoriteSongs,
      feedback: JSON.parse(localStorage.getItem('songFeedback') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'music-preferences-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your music data has been exported successfully.",
    });
  };

  const resetPreferences = () => {
    const defaultPrefs = {
      defaultLanguage: 'both' as const,
      autoPlay: false,
      showLyrics: true,
      recommendationCount: 20,
      favoriteGenres: [],
      excludedGenres: [],
      moodSensitivity: [7],
      enableNotifications: true,
      privateMode: false
    };
    
    savePreferences(defaultPrefs);
    toast({
      title: "Preferences Reset",
      description: "All preferences have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Music className="h-5 w-5" />
                Music Discovery Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Language Preference
                    </label>
                    <div className="flex gap-2 mt-2">
                      {['English', 'Hindi', 'both'].map((lang) => (
                        <Button
                          key={lang}
                          variant={preferences.defaultLanguage === lang ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => savePreferences({ ...preferences, defaultLanguage: lang as any })}
                          className="capitalize"
                        >
                          {lang === 'both' ? 'Both' : lang}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Recommendation Count: {preferences.recommendationCount}
                    </label>
                    <Slider
                      value={[preferences.recommendationCount]}
                      onValueChange={(value) => savePreferences({ ...preferences, recommendationCount: value[0] })}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Mood Sensitivity: {preferences.moodSensitivity[0]}/10
                    </label>
                    <Slider
                      value={preferences.moodSensitivity}
                      onValueChange={(value) => savePreferences({ ...preferences, moodSensitivity: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Higher values provide more diverse recommendations
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-redirect to Spotify
                      </label>
                      <p className="text-xs text-gray-500">Automatically open songs in Spotify</p>
                    </div>
                    <Switch
                      checked={preferences.autoPlay}
                      onCheckedChange={(checked) => savePreferences({ ...preferences, autoPlay: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show Song Descriptions
                      </label>
                      <p className="text-xs text-gray-500">Display detailed song information</p>
                    </div>
                    <Switch
                      checked={preferences.showLyrics}
                      onCheckedChange={(checked) => savePreferences({ ...preferences, showLyrics: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Notifications
                      </label>
                      <p className="text-xs text-gray-500">Get notified about new features</p>
                    </div>
                    <Switch
                      checked={preferences.enableNotifications}
                      onCheckedChange={(checked) => savePreferences({ ...preferences, enableNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Private Mode
                      </label>
                      <p className="text-xs text-gray-500">Don't save listening history</p>
                    </div>
                    <Switch
                      checked={preferences.privateMode}
                      onCheckedChange={(checked) => savePreferences({ ...preferences, privateMode: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <Headphones className="h-5 w-5" />
                Genre Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorite Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={preferences.favoriteGenres.includes(genre) ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleGenre(genre, 'favorite')}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Excluded Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={preferences.excludedGenres.includes(genre) ? 'destructive' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleGenre(genre, 'excluded')}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button onClick={clearHistory} variant="outline" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear History
                </Button>
                <Button onClick={resetPreferences} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Discoveries ({listeningHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listeningHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No listening history yet. Start discovering music!</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {listeningHistory.map((song, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                      </div>
                      <Badge variant="outline">{song.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorite Songs ({favoriteSongs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteSongs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No favorite songs yet. Start rating songs!</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {favoriteSongs.map((song, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Badge variant="outline">{song.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Music className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.totalSongsDiscovered}</p>
                <p className="text-sm text-gray-500">Songs Discovered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm font-bold capitalize">{stats.favoriteGenre}</p>
                <p className="text-sm text-gray-500">Favorite Genre</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.listeningStreak}</p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{stats.totalListeningTime}h</p>
                <p className="text-sm text-gray-500">Total Time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Music Discovery Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Recommendation Accuracy</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Based on your ratings</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Discovery Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 dark:bg-green-800 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">Exploration vs comfort zone</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPreferences;
