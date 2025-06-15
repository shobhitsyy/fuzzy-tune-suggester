
import { supabase } from "@/integrations/supabase/client";

export interface MoodParams {
  energy: number;  // 1-10
  mood: number;    // 1-10
  focus: number;   // 1-10
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

function getRobustMoodCategories(moodParams: MoodParams): string[] {
  const cat = [];

  // Energy mapping (1-10)
  if (moodParams.energy <= 3) {
    cat.push('calm', 'relaxed', 'mellow');
  } else if (moodParams.energy <= 7) {
    cat.push('moderate', 'chill');
  } else {
    cat.push('energetic', 'upbeat', 'fun');
  }

  // Mood mapping (1-10)
  if (moodParams.mood <= 3) {
    cat.push('calm', 'relaxed', 'sad', 'emotional');
  } else if (moodParams.mood <= 7) {
    cat.push('moderate', 'mellow', 'classic');
  } else {
    cat.push('upbeat', 'energetic', 'happy', 'fun');
  }

  // Focus mapping (1-10)
  if (moodParams.focus <= 3) {
    cat.push('calm', 'relaxed', 'chill', 'mellow');
  } else if (moodParams.focus <= 7) {
    cat.push('moderate', 'classic');
  } else {
    cat.push('energetic', 'upbeat', 'epic', 'motivational');
  }

  // Deduplicate, lowercase to avoid DB mismatch, and slice to top 7 for variety
  return [...new Set(cat.map(x => x.toLowerCase()))].slice(0, 7);
}

export class RecommendationService {
  static async getRecommendations(
    moodParams: MoodParams,
    includeEnglish: boolean,
    includeHindi: boolean,
    maxSongs: number = 20
  ): Promise<SongRecommendation[]> {
    const categories = getRobustMoodCategories(moodParams);
    let languageFilter: string[] = [];
    if (includeEnglish) languageFilter.push('English');
    if (includeHindi) languageFilter.push('Hindi');
    if (languageFilter.length === 0) throw new Error('No language selected');

    // First, find best matches by BOTH language and mood categories
    let { data: songs, error } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .in('language', languageFilter)
      .in('category', categories)
      .limit(maxSongs);

    if (error) throw error;

    // Not enough? Fill up with other songs in the selected languages, not just the same IDs
    if (songs && songs.length < maxSongs) {
      const gotIds = (songs || []).map(s => s.id);
      const { data: fallbackSongs } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .in('language', languageFilter)
        .not('id', 'in', gotIds)
        .order('RANDOM()')
        .limit(maxSongs - (songs?.length || 0));
      songs = songs.concat(fallbackSongs || []);
    }

    // Even fewer? Just take random from the selected language if still less than maxSongs
    if (songs && songs.length < maxSongs) {
      const gotIds = (songs || []).map(s => s.id);
      const { data: moreFallback } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .in('language', languageFilter)
        .not('id', 'in', gotIds)
        .order('RANDOM()')
        .limit(maxSongs - (songs?.length || 0));
      songs = songs.concat(moreFallback || []);
    }

    return (songs as SongRecommendation[]) || [];
  }

  static async getSimilarSongs(
    songId: string,
    maxSongs: number = 5
  ): Promise<SongRecommendation[]> {
    // First find the reference song's category and language
    const { data: song, error } = await supabase
      .from('songs')
      .select('category,language')
      .eq('id', songId)
      .maybeSingle();

    if (error || !song) throw new Error('Reference song not found');

    // Find similar by category and language, excluding the song itself
    const { data: songs, error: errorSimilar } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .eq('category', song.category)
      .eq('language', song.language)
      .neq('id', songId)
      .order('RANDOM()')
      .limit(maxSongs);

    if (errorSimilar) throw errorSimilar;

    return (songs as SongRecommendation[]) || [];
  }
}
