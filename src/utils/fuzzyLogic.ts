// Types for our fuzzy input parameters
export interface MoodParams {
  heartRate: number; // 0-100 (beats per minute normalized)
  timeOfDay: number; // 0-24 (hours)
  activity: number; // 0-10 (0 for resting, 10 for workout)
  mood: number; // 0-10 (0 for calm, 10 for Energetic)
}

// New interface for the enhanced mood selector
export interface MoodInputs {
  energy: number; // 0-10
  mood: number; // 0-10  
  focus: number; // 0-10
}

// Song genre/type categories - Export as both enum and type
export enum SongCategory {
  CALM = 'calm',
  RELAXED = 'relaxed',
  MODERATE = 'moderate',
  UPBEAT = 'upbeat',
  ENERGETIC = 'energetic'
}

// Also export as type for compatibility
export type SongCategoryType = 'calm' | 'relaxed' | 'moderate' | 'upbeat' | 'energetic';

// Song interface
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  language: 'English' | 'Hindi';
  category: SongCategoryType;
  coverImage: string;
  duration: string;
  spotifyUrl?: string;
  tags: string[];
  description: string;
}

// Helper function to calculate membership values
export const calculateMembership = (
  heartRate: number,
  activity: number,
  mood: number
) => {
  // Make "sad" (low mood) really push towards calm/relaxed, not moderate
  const params: MoodParams = {
    heartRate,
    timeOfDay: new Date().getHours(),
    activity,
    mood,
  };

  const base = {
    calm: calmMembership(params),
    relaxed: relaxedMembership(params),
    moderate: moderateMembership(params),
    upbeat: upbeatMembership(params),
    energetic: energeticMembership(params),
  };
  // Adjust for sadness (mood<=3), avoid moderate for low mood
  if (mood <= 3) {
    base.calm += 0.5;
    base.relaxed += 0.25;
    base.moderate -= 0.7;
    base.upbeat -= 0.5;
    base.energetic -= 0.4;
  }
  // If high energy/activity, upweight upbeat/energetic strongly
  if (activity >= 8 || heartRate >= 90) {
    base.energetic += 0.5;
    base.upbeat += 0.4;
    base.calm -= 0.3;
    base.moderate -= 0.3;
  }
  // Never let "moderate" dominate for extreme mood/activity
  if (Math.abs(mood - 5) > 3) base.moderate -= 0.3;
  return base;
};

// New function to calculate mood memberships from MoodInputs (fix: more varied and correct)
export const calculateMoodMemberships = (inputs: MoodInputs): Record<SongCategoryType, number> => {
  // Energy maps to activity; focus affects heart rate simulation by a lesser degree
  const heartRate = 60 + (inputs.energy * 3) + (inputs.focus * 1.5); // 60-105 range
  const activity = inputs.energy; // Direct mapping
  const mood = inputs.mood; // Direct mapping

  return calculateMembership(heartRate, activity, mood);
};

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

// Calculate membership in the "moderate" category
const moderateMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - Math.abs(params.heartRate - 80) / 20);
  const activityFactor = Math.max(0, 1 - Math.abs(params.activity - 5) / 3);
  const moodFactor = Math.max(0, 1 - Math.abs(params.mood - 5) / 3);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "upbeat" category
const upbeatMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.max(0, 1 - Math.abs(params.heartRate - 90) / 20);
  const activityFactor = Math.max(0, 1 - Math.abs(params.activity - 7) / 3);
  const moodFactor = Math.max(0, 1 - Math.abs(params.mood - 7) / 3);
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Calculate membership in the "energetic" category
const energeticMembership = (params: MoodParams): number => {
  const heartRateFactor = Math.min(1, Math.max(0, (params.heartRate - 85) / 25));
  const activityFactor = Math.min(1, Math.max(0, (params.activity - 7) / 3));
  const moodFactor = Math.min(1, Math.max(0, (params.mood - 7) / 3));
  
  return (heartRateFactor * 0.3 + activityFactor * 0.3 + moodFactor * 0.4);
};

// Determine the recommended song category (fix: avoid always 'moderate', reflect input weights)
export const determineSongCategory = (params: MoodParams): { 
  category: SongCategoryType, 
  memberships: Record<SongCategoryType, number> 
} => {
  // Apply time of day factor as a modifier
  const timeFactor = timeOfDayFactor(params.timeOfDay);

  // Calculate memberships for each category
  const memberships: Record<SongCategoryType, number> = {
    calm: Math.max(0, calmMembership(params) * (params.timeOfDay >= 20 || params.timeOfDay <= 7 ? 1.15 : 1)),
    relaxed: Math.max(0, relaxedMembership(params)),
    moderate: Math.max(0, moderateMembership(params) * (Math.abs(params.mood - 5) <= 2 ? 1 : 0.8)),
    upbeat: Math.max(0, upbeatMembership(params) * (params.activity > 5 ? 1.18 : 1)),
    energetic: Math.max(0, energeticMembership(params) * (params.heartRate > 85 || params.activity > 7 ? 1.22 : 1))
  };

  // Find the highest (not just the first) and avoid "moderate" if there's another close contender
  let maxCategory: SongCategoryType = "moderate";
  let maxValue = -1;
  for (const [category, value] of Object.entries(memberships)) {
    if (value > maxValue) {
      maxValue = value;
      maxCategory = category as SongCategoryType;
    }
  }
  // If mood <= 2: force calm/relaxed
  if (params.mood <= 2) {
    if (memberships["calm"] >= memberships["relaxed"]) maxCategory = "calm";
    else maxCategory = "relaxed";
  }
  // If activity or heart rate high, boost energetic/upbeat
  if (params.activity >= 8 || params.heartRate >= 95) {
    if (memberships["energetic"] > memberships["upbeat"]) maxCategory = "energetic";
    else maxCategory = "upbeat";
  }

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
