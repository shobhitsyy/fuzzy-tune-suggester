
import { supabase } from "@/integrations/supabase/client";
import { calculateMoodMemberships, SongCategoryType, MoodInputs } from "@/utils/fuzzyLogic";

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

// Helper to ensure language filter
function _getLanguageFilter(eng: boolean, hin: boolean): string[] {
  const lang: string[] = [];
  if (eng) lang.push('English');
  if (hin) lang.push('Hindi');
  return lang;
}

// Get unique songs by ID
function getUniqueSongsById(songs: any[]): any[] {
  const seen: Record<string, boolean> = {};
  return songs.filter((song) => {
    if (seen[song.id]) return false;
    seen[song.id] = true;
    return true;
  });
}

export class RecommendationService {
  static async getRecommendations(
    moodParams: MoodParams,
    includeEnglish: boolean,
    includeHindi: boolean,
    maxSongs: number = 20
  ): Promise<SongRecommendation[]> {
    // Use fuzzy logic to get membership scores for each category
    const memberships: Record<SongCategoryType, number> = calculateMoodMemberships({
      energy: moodParams.energy,
      mood: moodParams.mood,
      focus: moodParams.focus,
    });

    // Sort categories by their scores (descending)
    const sortedCategories = Object.entries(memberships)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat as SongCategoryType);

    const languageFilter = _getLanguageFilter(includeEnglish, includeHindi);
    if (languageFilter.length === 0) throw new Error('No language selected');

    let foundSongs: SongRecommendation[] = [];
    let queriedIds: Set<string> = new Set();

    // Try to fetch songs from matching categories, ordered by importance
    for (const category of sortedCategories) {
      const { data, error } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .in('language', languageFilter)
        .eq('category', category)
        .order('RANDOM()')
        .limit(maxSongs);

      if (error) continue;
      if (data && data.length > 0) {
        for (const s of data) {
          if (!queriedIds.has(s.id)) {
            foundSongs.push(s as SongRecommendation);
            queriedIds.add(s.id);
            if (foundSongs.length === maxSongs) return foundSongs;
          }
        }
      }
      if (foundSongs.length >= maxSongs) break;
    }

    // Fallback: pull more from language, ignoring category
    if (foundSongs.length < maxSongs) {
      const { data: fallbackLang, error: err2 } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .in('language', languageFilter)
        .not('id', 'in', [...queriedIds])
        .order('RANDOM()')
        .limit(maxSongs - foundSongs.length);
      if (!err2 && fallbackLang) {
        for (const song of fallbackLang) {
          if (!queriedIds.has(song.id)) {
            foundSongs.push(song as SongRecommendation);
            queriedIds.add(song.id);
            if (foundSongs.length === maxSongs) break;
          }
        }
      }
    }

    // Fallback: pull more random songs from the DB, disregard language/category
    if (foundSongs.length < maxSongs) {
      const { data: anySongs, error: err3 } = await supabase
        .from('songs')
        .select('id,title,artist,category,language,cover_image,album,duration,release_date')
        .not('id', 'in', [...queriedIds])
        .order('RANDOM()')
        .limit(maxSongs - foundSongs.length);

      if (!err3 && anySongs) {
        for (const song of anySongs) {
          if (!queriedIds.has(song.id)) {
            foundSongs.push(song as SongRecommendation);
            queriedIds.add(song.id);
            if (foundSongs.length === maxSongs) break;
          }
        }
      }
    }

    // Final deduplication/slicing (just in case!)
    return foundSongs.slice(0, maxSongs);
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
