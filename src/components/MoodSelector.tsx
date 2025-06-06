
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MoodParams } from "@/utils/fuzzyLogic";
import { Activity, Heart, Clock, Gauge, Globe } from "lucide-react";

interface MoodSelectorProps {
  moodParams: MoodParams;
  onMoodChange: (params: MoodParams) => void;
  includeEnglish: boolean;
  includeHindi: boolean;
  onLanguageChange: (english: boolean, hindi: boolean) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  moodParams, 
  onMoodChange, 
  includeEnglish, 
  includeHindi, 
  onLanguageChange 
}) => {
  const [heartRate, setHeartRate] = useState<number>(moodParams.heartRate);
  const [timeOfDay, setTimeOfDay] = useState<number>(moodParams.timeOfDay);
  const [activity, setActivity] = useState<number>(moodParams.activity);
  const [mood, setMood] = useState<number>(moodParams.mood);

  // Update parameters when any value changes
  useEffect(() => {
    onMoodChange({
      heartRate,
      timeOfDay,
      activity,
      mood,
    });
  }, [heartRate, timeOfDay, activity, mood, onMoodChange]);

  // Update local state when props change
  useEffect(() => {
    setHeartRate(moodParams.heartRate);
    setTimeOfDay(moodParams.timeOfDay);
    setActivity(moodParams.activity);
    setMood(moodParams.mood);
  }, [moodParams]);

  // Helper function for time display
  const formatTime = (hour: number): string => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="animate-fade-in">
      <Card className="glass-card overflow-hidden border-0 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium">Heart Rate</h3>
                </div>
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  {heartRate} BPM
                </span>
              </div>
              <Slider
                className="mood-slider"
                value={[heartRate]}
                min={50}
                max={120}
                step={1}
                onValueChange={(value) => setHeartRate(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Resting</span>
                <span>Active</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Time of Day</h3>
                </div>
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  {formatTime(timeOfDay)}
                </span>
              </div>
              <Slider
                className="mood-slider"
                value={[timeOfDay]}
                min={0}
                max={23}
                step={1}
                onValueChange={(value) => setTimeOfDay(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Midnight</span>
                <span>Morning</span>
                <span>Noon</span>
                <span>Evening</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Activity Level</h3>
                </div>
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  {activity}/10
                </span>
              </div>
              <Slider
                className="mood-slider"
                value={[activity]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setActivity(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Resting</span>
                <span>Moderate</span>
                <span>Workout</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Current Mood</h3>
                </div>
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  {mood}/10
                </span>
              </div>
              <Slider
                className="mood-slider"
                value={[mood]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setMood(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Calm</span>
                <span>Balanced</span>
                <span>Energetic</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-medium">Language Preferences</h3>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="english"
                    checked={includeEnglish}
                    onCheckedChange={(checked) => onLanguageChange(checked, includeHindi)}
                  />
                  <Label htmlFor="english">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hindi"
                    checked={includeHindi}
                    onCheckedChange={(checked) => onLanguageChange(includeEnglish, checked)}
                  />
                  <Label htmlFor="hindi">Hindi</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodSelector;
