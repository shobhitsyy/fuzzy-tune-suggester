
import { curatedSongs, extractCuratedSongsFromSpotify } from './spotifyCuratedSongs';
import { upsertSongsToDb } from './supabaseSongDb';

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
};
