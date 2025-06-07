
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, History, Star, Settings, Music2, Palette } from 'lucide-react';
import { Song } from '@/utils/fuzzyLogic';

interface UserPreferencesProps {
  onPreferencesChange?: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  favoriteGenres: string[];
  preferredLanguages: string[];
  energyRange: [number, number];
  timePreferences: Record<string, string[]>;
  excludedArtists: string[];
  playlistSettings: {
    autoPlay: boolean;
    crossfade: boolean;
    repeatMode: 'none' | 'song' | 'playlist';
  };
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

const UserPreferences = ({ onPreferencesChange }: UserPreferencesProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    preferredLanguages: ['English', 'Hindi'],
    energyRange: [3, 8],
    timePreferences: {
      morning: ['Calm', 'Relaxed'],
      afternoon: ['Moderate', 'Upbeat'],
      evening: ['Relaxed', 'Moderate'],
      night: ['Calm', 'Relaxed']
    },
    excludedArtists: [],
    playlistSettings: {
      autoPlay: true,
      crossfade: false,
      repeatMode: 'none'
    },
    theme: 'auto',
    notifications: true
  });

  const [recentHistory, setRecentHistory] = useState<Song[]>([]);
  const [favoriteGenres] = useState([
    'Bollywood', 'Rock', 'Pop', 'Classical', 'Jazz', 'Electronic', 
    'Hip Hop', 'Folk', 'Indie', 'R&B', 'Country', 'Sufi'
  ]);

  useEffect(() => {
    // Load user preferences from localStorage
    const saved = localStorage.getItem('musicMoodPreferences');
    if (saved) {
      try {
        const parsedPrefs = JSON.parse(saved);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    // Load recent history
    const history = localStorage.getItem('musicMoodHistory');
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        setRecentHistory(parsedHistory.slice(0, 10)); // Last 10 songs
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('musicMoodPreferences', JSON.stringify(newPreferences));
    onPreferencesChange?.(newPreferences);
  };

  const toggleGenre = (genre: string) => {
    const newGenres = preferences.favoriteGenres.includes(genre)
      ? preferences.favoriteGenres.filter(g => g !== genre)
      : [...preferences.favoriteGenres, genre];
    
    savePreferences({
      ...preferences,
      favoriteGenres: newGenres
    });
  };

  const handleEnergyRangeChange = (values: number[]) => {
    savePreferences({
      ...preferences,
      energyRange: [values[0], values[1]]
    });
  };

  const clearHistory = () => {
    setRecentHistory([]);
    localStorage.removeItem('musicMoodHistory');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Favorite Genres */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Favorite Genres</Label>
            <div className="flex flex-wrap gap-2">
              {favoriteGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant={preferences.favoriteGenres.includes(genre) ? 'default' : 'outline'}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Energy Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Preferred Energy Range ({preferences.energyRange[0]} - {preferences.energyRange[1]})
            </Label>
            <Slider
              value={preferences.energyRange}
              onValueChange={handleEnergyRangeChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Calm</span>
              <span>Moderate</span>
              <span>Energetic</span>
            </div>
          </div>

          <Separator />

          {/* Playback Settings */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Playback Settings</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-sm">Auto-play next song</Label>
                <Switch
                  id="autoplay"
                  checked={preferences.playlistSettings.autoPlay}
                  onCheckedChange={(checked) => savePreferences({
                    ...preferences,
                    playlistSettings: { ...preferences.playlistSettings, autoPlay: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="crossfade" className="text-sm">Crossfade between songs</Label>
                <Switch
                  id="crossfade"
                  checked={preferences.playlistSettings.crossfade}
                  onCheckedChange={(checked) => savePreferences({
                    ...preferences,
                    playlistSettings: { ...preferences.playlistSettings, crossfade: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">Enable notifications</Label>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => savePreferences({
                    ...preferences,
                    notifications: checked
                  })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Recent Listening History</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              disabled={recentHistory.length === 0}
            >
              Clear History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentHistory.length > 0 ? (
            <div className="space-y-3">
              {recentHistory.map((song, index) => (
                <div key={`${song.id}-${index}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {song.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Music2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No listening history yet</p>
              <p className="text-xs">Start exploring music to see your history here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Star className="h-5 w-5" />
              <span className="text-xs">Export Favorites</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Palette className="h-5 w-5" />
              <span className="text-xs">Theme Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
