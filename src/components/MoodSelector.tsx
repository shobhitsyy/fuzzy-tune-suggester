
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MoodInputs } from "@/utils/fuzzyLogic";
import { Activity, Gauge, Brain } from "lucide-react";

interface MoodSelectorProps {
  onMoodChange: (inputs: MoodInputs) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  onMoodChange
}) => {
  const [energy, setEnergy] = useState<number>(5);
  const [mood, setMood] = useState<number>(5);
  const [focus, setFocus] = useState<number>(5);

  // Update parameters when any value changes
  useEffect(() => {
    onMoodChange({
      energy,
      mood,
      focus,
    });
  }, [energy, mood, focus, onMoodChange]);

  return (
    <div className="animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Energy Level</h3>
            </div>
            <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
              {energy}/10
            </span>
          </div>
          <Slider
            className="mood-slider"
            value={[energy]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => setEnergy(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Energy</span>
            <span>High Energy</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-medium">Mood</h3>
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
            <span>Sad</span>
            <span>Happy</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Focus</h3>
            </div>
            <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
              {focus}/10
            </span>
          </div>
          <Slider
            className="mood-slider"
            value={[focus]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => setFocus(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Relaxed</span>
            <span>Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
