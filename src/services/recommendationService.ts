
import { supabase } from "@/integrations/supabase/client";

export interface MoodParams {
  energy: number;
  mood: number;
  focus: number;
}

export interface SongRecommendation {
  id: string;
  title: string;
  artist: string;
  category: string;
  language: string;
  cover_image?: string | null;
  album?: string;
  duration?: string;
  release_date?: string;
}

function getMoodCategory(moodParams: MoodParams): string[] {
  const categories: string[] = [];

  // Energy mapping
  if (moodParams.energy <= 3) {
    categories.push('calm', 'relaxed');
  } else if (moodParams.energy <= 7) {
    categories.push('moderate', 'chill');
  } else {
    categories.push('energetic', 'upbeat');
  }

  // Mood mapping
  if (moodParams.mood <= 3) {
    categories.push('calm', 'relaxed');
  } else if (moodParams.mood <= 7) {
    categories.push('moderate', 'relaxed');
  } else {
    categories.push('upbeat', 'energetic');
  }

  // Focus mapping
  if (moodParams.focus <= 3) {
    categories.push('calm', 'relaxed');
  } else if (moodParams.focus <= 7) {
    categories.push('moderate');
  } else {
    categories.push('energetic', 'upbeat');
  }

  return [...new Set(categories)];
}

export class RecommendationService {
  static async getRecommendations(
    moodParams: MoodParams,
    includeEnglish: boolean,
    includeHindi: boolean,
    maxSongs: number = 20
  ): Promise<SongRecommendation[]> {
    const categories = getMoodCategory(moodParams);
    let languageFilter: string[] = [];
    if (includeEnglish) languageFilter.push('English');
    if (includeHindi) languageFilter.push('Hindi');
    if (languageFilter.length === 0) throw new Error('No language selected');

    // First pass: get top category matches
    let { data: songs, error } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .in('language', languageFilter)
      .in('category', categories)
      .limit(maxSongs);

    if (error) throw error;

    // If not enough, fill random
    if (songs && songs.length < maxSongs) {
      const { data: fallbackSongs } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .in('language', languageFilter)
        .not('id', 'in', (songs || []).map(s => s.id))
        .order('RANDOM()')
        .limit(maxSongs - (songs?.length || 0));
      songs = songs.concat(fallbackSongs || []);
    }

    return (songs as SongRecommendation[]) || [];
  }
}
