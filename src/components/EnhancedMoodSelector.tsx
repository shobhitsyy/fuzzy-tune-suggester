
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MoodInputs } from '@/utils/fuzzyLogic';
import { Heart, Activity, Clock, Zap } from 'lucide-react';

interface EnhancedMoodSelectorProps {
  moodInputs: MoodInputs;
  onMoodChange: (inputs: MoodInputs) => void;
  includeEnglish: boolean;
  includeHindi: boolean;
  onLanguageChange: (english: boolean, hindi: boolean) => void;
}

const EnhancedMoodSelector: React.FC<EnhancedMoodSelectorProps> = ({
  moodInputs,
  onMoodChange,
  includeEnglish,
  includeHindi,
  onLanguageChange,
}) => {
  const handleParamChange = (param: keyof MoodInputs, value: number) => {
    onMoodChange({
      ...moodInputs,
      [param]: value,
    });
  };

  const getEnergyLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'High';
    return 'Very High';
  };

  const getMoodLabel = (value: number) => {
    if (value <= 2) return 'Sad';
    if (value <= 4) return 'Calm';
    if (value <= 6) return 'Neutral';
    if (value <= 8) return 'Happy';
    return 'Excited';
  };

  const getFocusLabel = (value: number) => {
    if (value <= 2) return 'Distracted';
    if (value <= 4) return 'Relaxed';
    if (value <= 6) return 'Normal';
    if (value <= 8) return 'Focused';
    return 'Intense Focus';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Language Selection */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-3 sm:p-4">
          <Label className="text-sm sm:text-base font-semibold text-gray-700 mb-3 block">
            Preferred Languages
          </Label>
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant={includeEnglish ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageChange(!includeEnglish, includeHindi)}
              className={`flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 ${
                includeEnglish 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md' 
                  : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              🇺🇸 English
            </Button>
            <Button
              variant={includeHindi ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageChange(includeEnglish, !includeHindi)}
              className={`flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 ${
                includeHindi 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' 
                  : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              🇮🇳 हिंदी
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Energy Level */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <Label className="text-sm sm:text-base font-medium text-gray-700">
                Energy Level
              </Label>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Slider
                value={[moodInputs.energy]}
                onValueChange={([value]) => handleParamChange('energy', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">{moodInputs.energy}/10</span>
                <span className="text-blue-600 font-medium">{getEnergyLabel(moodInputs.energy)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Level */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <Label className="text-sm sm:text-base font-medium text-gray-700">
                Focus Level
              </Label>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Slider
                value={[moodInputs.focus]}
                onValueChange={([value]) => handleParamChange('focus', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">{moodInputs.focus}/10</span>
                <span className="text-blue-600 font-medium">{getFocusLabel(moodInputs.focus)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood */}
        <Card className="bg-white shadow-sm border-gray-200 sm:col-span-2">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              <Label className="text-sm sm:text-base font-medium text-gray-700">
                Mood
              </Label>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Slider
                value={[moodInputs.mood]}
                onValueChange={([value]) => handleParamChange('mood', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">{moodInputs.mood}/10</span>
                <span className="text-blue-600 font-medium">{getMoodLabel(moodInputs.mood)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMoodSelector;
