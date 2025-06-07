
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MoodParams } from '@/utils/fuzzyLogic';
import { Heart, Clock, Activity, Smile, Music, Sun, Moon, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EnhancedMoodSelectorProps {
  moodParams: MoodParams;
  onMoodChange: (params: MoodParams) => void;
  includeEnglish: boolean;
  includeHindi: boolean;
  onLanguageChange: (english: boolean, hindi: boolean) => void;
}

const EnhancedMoodSelector = ({
  moodParams,
  onMoodChange,
  includeEnglish,
  includeHindi,
  onLanguageChange
}: EnhancedMoodSelectorProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleHeartRateChange = (value: number[]) => {
    onMoodChange({
      ...moodParams,
      heartRate: value[0]
    });
  };

  const handleTimeOfDayChange = (value: number[]) => {
    onMoodChange({
      ...moodParams,
      timeOfDay: value[0]
    });
  };

  const handleActivityChange = (value: number[]) => {
    onMoodChange({
      ...moodParams,
      activity: value[0]
    });
  };

  const handleMoodChange = (value: number[]) => {
    onMoodChange({
      ...moodParams,
      mood: value[0]
    });
  };

  const getTimeLabel = (hour: number) => {
    if (hour < 6) return 'Late Night';
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  };

  const getActivityLabel = (level: number) => {
    if (level <= 2) return 'Resting';
    if (level <= 4) return 'Light Activity';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Active';
    return 'High Energy';
  };

  const getMoodLabel = (level: number) => {
    if (level <= 2) return 'Calm';
    if (level <= 4) return 'Relaxed';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Upbeat';
    return 'Energetic';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header with Theme Toggle */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl">Mood Settings</CardTitle>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Moon className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>{getCurrentDate()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physiological Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Heart Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={[moodParams.heartRate]}
                onValueChange={handleHeartRateChange}
                max={120}
                min={60}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>60 BPM</span>
                <span className="font-semibold text-purple-600">{moodParams.heartRate} BPM</span>
                <span>120 BPM</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              💡 Lower heart rate suggests calmer music preferences
            </div>
          </CardContent>
        </Card>

        {/* Time Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Time of Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={[moodParams.timeOfDay]}
                onValueChange={handleTimeOfDayChange}
                max={23}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>00:00</span>
                <span className="font-semibold text-blue-600">
                  {String(moodParams.timeOfDay).padStart(2, '0')}:00 - {getTimeLabel(moodParams.timeOfDay)}
                </span>
                <span>23:00</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              💡 Different times suggest different energy levels
            </div>
          </CardContent>
        </Card>

        {/* Activity Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span>Activity Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={[moodParams.activity]}
                onValueChange={handleActivityChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Rest</span>
                <span className="font-semibold text-green-600">
                  {moodParams.activity}/10 - {getActivityLabel(moodParams.activity)}
                </span>
                <span>Intense</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              💡 Higher activity levels match with more energetic music
            </div>
          </CardContent>
        </Card>

        {/* Current Mood */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-5 w-5 text-yellow-500" />
              <span>Current Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={[moodParams.mood]}
                onValueChange={handleMoodChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Calm</span>
                <span className="font-semibold text-yellow-600">
                  {moodParams.mood}/10 - {getMoodLabel(moodParams.mood)}
                </span>
                <span>Energetic</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              💡 Your current emotional state influences music selection
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Language Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="english"
                checked={includeEnglish}
                onCheckedChange={(checked) => onLanguageChange(checked, includeHindi)}
              />
              <Label htmlFor="english" className="text-sm font-medium">
                English Songs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hindi"
                checked={includeHindi}
                onCheckedChange={(checked) => onLanguageChange(includeEnglish, checked)}
              />
              <Label htmlFor="hindi" className="text-sm font-medium">
                Hindi Songs
              </Label>
            </div>
          </div>
          {!includeEnglish && !includeHindi && (
            <p className="text-sm text-red-500 mt-2">
              Please select at least one language to get recommendations.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Mood Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <CardHeader>
          <CardTitle className="text-center">Your Current Vibe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {getMoodLabel(moodParams.mood)} • {getTimeLabel(moodParams.timeOfDay)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {moodParams.heartRate} BPM • Activity Level {moodParams.activity}/10
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Languages: {includeEnglish && includeHindi ? 'English & Hindi' : 
                         includeEnglish ? 'English Only' : 
                         includeHindi ? 'Hindi Only' : 'None Selected'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMoodSelector;
