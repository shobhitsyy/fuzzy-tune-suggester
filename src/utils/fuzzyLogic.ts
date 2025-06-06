
// Types for our fuzzy input parameters
export interface MoodParams {
  heartRate: number; // 0-100 (beats per minute normalized)
  timeOfDay: number; // 0-24 (hours)
  activity: number; // 0-10 (0 for resting, 10 for workout)
  mood: number; // 0-10 (0 for calm, 10 for Energetic)
}

// Song interface
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  language: 'English' | 'Hindi';
  category: SongCategory;
  coverImage: string;
  duration: string;
  spotifyUrl?: string;
  similarSongs?: string[];
  tags: string[];
  description: string;
}

// Song genre/type categories
export enum SongCategory {
  CALM = "Calm",
  RELAXED = "Relaxed",
  Moderate = "Moderate",
  Upbeat = "Upbeat",
  Energetic = "Energetic"
}

// Helper function to map time of day to a 0-1 scale with peaks for different times
const timeOfDayFactor = (time: number): number => {
  // Morning peak (7-9 AM)
  const morningPeak = Math.max(0, 1 - Math.abs(time - 8) / 2);
  // Afternoon slump (2-4 PM)
  const afternoonSlump = Math.max(0, 1 - Math.abs(time - 15) / 2) * 0.7;
  // Evening peak (6-9 PM)
  const eveningPeak = Math.max(0, 1 - Math.abs(time - 19.5) / 3.5);
  // Late night (10 PM - 2 AM)
  const lateNight = Math.max(0, 1 - Math.min(Math.abs(time - 0), Math.abs(time - 24)) / 4);
  
  return Math.max(morningPeak, afternoonSlump, eveningPeak, lateNight);
};

// Calculate membership in the "calm" category
const calmMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - (params.heartRate - 60) / 40);
  const activityFactor = Math.max(0, 1 - params.activity / 5);
  const moodFactor = Math.max(0, 1 - params.mood / 5);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "relaxed" category
const relaxedMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - Math.abs(params.heartRate - 70) / 20);
  const activityFactor = Math.max(0, 1 - Math.abs(params.activity - 3) / 3);
  const moodFactor = Math.max(0, 1 - Math.abs(params.mood - 3) / 3);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "Moderate" category
const ModerateMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - Math.abs(params.heartRate - 80) / 20);
  const activityFactor = Math.max(0, 1 - Math.abs(params.activity - 5) / 3);
  const moodFactor = Math.max(0, 1 - Math.abs(params.mood - 5) / 3);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "Upbeat" category
const UpbeatMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - Math.abs(params.heartRate - 90) / 20);
  const activityFactor = Math.max(0, 1 - Math.abs(params.activity - 7) / 3);
  const moodFactor = Math.max(0, 1 - Math.abs(params.mood - 7) / 3);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "Energetic" category
const EnergeticMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.min(1, Math.max(0, (params.heartRate - 85) / 25));
  const activityFactor = Math.min(1, Math.max(0, (params.activity - 7) / 3));
  const moodFactor = Math.min(1, Math.max(0, (params.mood - 7) / 3));
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Determine the recommended song category based on fuzzy logic
export const determineSongCategory = (params: MoodParams): { 
  category: SongCategory, 
  memberships: Record<SongCategory, number> 
} => {
  // Apply time of day factor as a modifier
  const timeFactor = timeOfDayFactor(params.timeOfDay);
  
  // Calculate memberships for each category
  const memberships = {
    [SongCategory.CALM]: calmMembership(params) * (params.timeOfDay >= 20 || params.timeOfDay <= 7 ? 1.2 : 1),
    [SongCategory.RELAXED]: relaxedMembership(params),
    [SongCategory.Moderate]: ModerateMembership(params),
    [SongCategory.Upbeat]: UpbeatMembership(params) * (params.timeOfDay >= 8 && params.timeOfDay <= 20 ? 1.2 : 1),
    [SongCategory.Energetic]: EnergeticMembership(params) * (params.timeOfDay >= 10 && params.timeOfDay <= 18 ? 1.2 : 1)
  };
  
  // Find category with highest membership
  let maxCategory = SongCategory.Moderate;
  let maxValue = 0;
  
  Object.entries(memberships).forEach(([category, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxCategory = category as SongCategory;
    }
  });
  
  return {
    category: maxCategory,
    memberships
  };
};

// Function to get recommendations with weightings
export const getRecommendations = (params: MoodParams, count: number = 5): string[] => {
  const { category, memberships } = determineSongCategory(params);
  // This would normally fetch from a real API
  // For now we'll just return the category
  return [category];
};
