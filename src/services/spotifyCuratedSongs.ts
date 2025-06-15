
import { spotifyService } from './spotifyService';
import { SongCategoryType } from '@/utils/fuzzyLogic';

export const curatedSongs: { english: any[], hindi: any[] } = {
  english: [
    { name: 'Blinding Lights', artist: 'The Weeknd', category: 'energetic' as SongCategoryType },
    { name: 'Watermelon Sugar', artist: 'Harry Styles', category: 'upbeat' as SongCategoryType },
    { name: 'Levitating', artist: 'Dua Lipa', category: 'energetic' as SongCategoryType },
    { name: 'Good 4 U', artist: 'Olivia Rodrigo', category: 'upbeat' as SongCategoryType },
    { name: 'Stay', artist: 'The Kid LAROI', category: 'moderate' as SongCategoryType }
  ],
  hindi: [
    { name: 'Kesariya', artist: 'Arijit Singh', category: 'relaxed' as SongCategoryType },
    { name: 'Raataan Lambiyan', artist: 'Tanishk Bagchi', category: 'calm' as SongCategoryType },
    { name: 'Mann Meri Jaan', artist: 'King', category: 'upbeat' as SongCategoryType },
    { name: 'Apna Bana Le', artist: 'Arijit Singh', category: 'relaxed' as SongCategoryType },
    { name: 'Baarish Ban Jaana', artist: 'Stebin Ben', category: 'calm' as SongCategoryType }
  ]
};

export async function extractCuratedSongsFromSpotify(curated: typeof curatedSongs) {
  const allSongs = [
    ...curated.english.map(song => ({ ...song, language: 'English' })),
    ...curated.hindi.map(song => ({ ...song, language: 'Hindi' }))
  ];

  const results: any[] = [];
  for (const song of allSongs) {
    const spotifyTrack = await spotifyService.searchSpecificTrack(song.name, song.artist);
    if (spotifyTrack) {
      results.push({
        ...song,
        spotifyTrack,
      });
    }
  }
  return results;
}
