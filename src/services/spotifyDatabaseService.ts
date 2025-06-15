import { curatedSongs, extractCuratedSongsFromSpotify } from './spotifyCuratedSongs';
import { upsertSongsToDb } from './supabaseSongDb';

/**
 * Add the given array of {name, artist, category, language} songs to the DB with Spotify metadata.
 * Example usage:
 *    await addSongsListToDatabase([
 *      { name: 'Shape of You', artist: 'Ed Sheeran', category: 'upbeat', language: 'English' }
 *    ]);
 */
export async function addSongsListToDatabase(songList: {
  name: string;
  artist: string;
  category: string;
  language: string;
}[]): Promise<any> {
  console.log("Starting custom song extraction for:", songList.map(s => s.name).join(', '));
  const curatedFormat = {
    english: songList.filter(s => s.language.toLowerCase() === 'english'),
    hindi: songList.filter(s => s.language.toLowerCase() === 'hindi')
  };
  const curatedWithSpotify = await extractCuratedSongsFromSpotify(curatedFormat);
  const results = await upsertSongsToDb(curatedWithSpotify);
  console.log('🎉 Custom song update complete:', results);
  return results;
}

export const addCuratedSongsToDatabase = async () => {
  console.log("Starting manual curated song extraction...");
  const curatedWithSpotify = await extractCuratedSongsFromSpotify(curatedSongs);
  const results = await upsertSongsToDb(curatedWithSpotify);
  console.log('🎉 Song update complete:', results);
  return results;
};

export const enrichExistingSongs = async (batchSize: number = 20) => {
  return { updated: 0, newSongs: 0, errors: 0 };
};

export const updateAllCategories = async () => {
  return {
    energetic: { updated: 0, newSongs: 0, errors: 0 },
    upbeat: { updated: 0, newSongs: 0, errors: 0 },
    moderate: { updated: 0, newSongs: 0, errors: 0 },
    relaxed: { updated: 0, newSongs: 0, errors: 0 },
    calm: { updated: 0, newSongs: 0, errors: 0 }
  };
};

export const spotifyDatabaseService = {
  addCuratedSongsToDatabase,
  enrichExistingSongs,
  updateAllCategories,
  addSongsListToDatabase,
};
