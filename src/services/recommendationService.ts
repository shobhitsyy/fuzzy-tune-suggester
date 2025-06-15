
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
  const categories = [];
  if (moodParams.energy <= 3) categories.push('calm', 'relaxed', 'mellow');
  else if (moodParams.energy <= 7) categories.push('moderate', 'chill');
  else categories.push('energetic', 'upbeat', 'fun');

  if (moodParams.mood <= 3) categories.push('calm', 'relaxed', 'sad', 'emotional');
  else if (moodParams.mood <= 7) categories.push('moderate', 'mellow', 'classic');
  else categories.push('upbeat', 'energetic', 'happy', 'fun');

  if (moodParams.focus <= 3) categories.push('calm', 'relaxed', 'chill', 'mellow');
  else if (moodParams.focus <= 7) categories.push('moderate', 'classic');
  else categories.push('energetic', 'upbeat', 'epic', 'motivational');

  return [...new Set(categories.map(x => x.toLowerCase()))].slice(0, 7);
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
    
    // 1. Try to match language + category
    let { data: songs, error } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .in('language', languageFilter)
      .in('category', categories)
      .limit(maxSongs);

    console.log("Step 1. language+category", { categories, languageFilter, found: songs?.length });

    if (error) throw error;
    if (songs && songs.length >= maxSongs) return songs as SongRecommendation[];

    // 2. Fallback: match any language in filter, not in initial result
    let gotIds = (songs || []).map(s => s.id);
    const { data: fallbackSongs } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .in('language', languageFilter)
      .not('id', 'in', gotIds)
      .order('RANDOM()')
      .limit(maxSongs - (songs?.length || 0));

    console.log("Step 2. fallback language", { found: fallbackSongs?.length });

    if (fallbackSongs && fallbackSongs.length > 0) songs = songs.concat(fallbackSongs);

    if (songs && songs.length >= maxSongs) return songs.slice(0, maxSongs);

    // 3. Fallback: fill with completely random songs not yet included
    gotIds = (songs || []).map(s => s.id);
    const { data: extraFallback } = await supabase
      .from('songs')
      .select('id,title,artist,category,language,cover_image,album,duration,release_date')
      .not('id', 'in', gotIds)
      .order('RANDOM()')
      .limit(maxSongs - (songs?.length || 0));

    console.log("Step 3. extra fallback any song", { found: extraFallback?.length });

    if (extraFallback && extraFallback.length > 0) songs = songs.concat(extraFallback);

    // FINAL: If still none, just get any song at all (unfiltered, covers the case of very empty DB)
    if (!songs || songs.length === 0) {
      const { data: anySongs, error: anyError } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .order('RANDOM()')
        .limit(maxSongs);

      console.log("Step 4. ABSOLUTE fallback any", { found: anySongs?.length });

      if (anySongs && anySongs.length > 0) {
        songs = anySongs;
      } else {
        // If really, really empty DB; will return empty still.
        return [];
      }
      if (anyError) throw anyError;
    }

    // Final deduplication (avoid duplicates if multiple sources)
    const unique: { [id: string]: SongRecommendation } = {};
    (songs || []).forEach((song: any) => {
      unique[song.id] = song as SongRecommendation;
    });
    return Object.values(unique).slice(0, maxSongs);
  }

  static async getSimilarSongs(
    songId: string,
    maxSongs: number = 5
  ): Promise<SongRecommendation[]> {
    const { data: song, error } = await supabase
      .from('songs')
      .select('category,language')
      .eq('id', songId)
      .maybeSingle();

    if (error || !song) throw new Error('Reference song not found');

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
