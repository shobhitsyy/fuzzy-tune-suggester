import { SongCategory, determineSongCategory, MoodParams } from './fuzzyLogic';

// Song data structure
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  language: 'english' | 'hindi';
  category: SongCategory;
  coverImage: string;
  duration: string;
  spotifyUrl?: string;
  similarSongs?: string[];
  tags: string[];
  description: string;
}

// Sample song database
export const songDatabase: Song[] = [
  // CALM - English Songs
  {
    id: 'en-calm-1',
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Weightless',
    releaseDate: '2012-11-13',
    language: 'english',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8eabd5a347323d6fd0158f4',
    duration: '8:09',
    spotifyUrl: 'https://open.spotify.com/track/4wLXwxDeWQ8mtUIRPxGiD6',
    similarSongs: ['en-calm-2', 'en-calm-3'],
    tags: ['ambient', 'relaxation', 'meditation'],
    description: 'Specifically designed with sound therapists, this track uses carefully arranged harmonies, rhythms, and bass lines to slow heart rate, reduce blood pressure and lower stress levels.'
  },
  {
    id: 'en-calm-2',
    title: 'Saturn',
    artist: 'Sleeping At Last',
    album: 'Atlas: Space',
    releaseDate: '2014-09-19',
    language: 'english',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ba18254476622df36c5090ca',
    duration: '4:49',
    spotifyUrl: 'https://open.spotify.com/track/1oOD1pVZX8a1AxXdGUM5qK',
    similarSongs: ['en-calm-1', 'en-relaxed-1'],
    tags: ['cinematic', 'orchestral', 'peaceful'],
    description: 'A beautifully composed orchestral piece that evokes a sense of wonder about the universe. The delicate piano and string arrangement creates a peaceful, contemplative atmosphere.'
  },

  // CALM - Hindi Songs
  {
    id: 'hi-calm-1',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    album: 'Aashiqui 2',
    releaseDate: '2013-04-08',
    language: 'hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a6afb6ab63acf0ceb2d2aff4',
    duration: '4:22',
    spotifyUrl: 'https://open.spotify.com/track/5mEqD9DdbVCBwMOjBMsGIN',
    similarSongs: ['hi-calm-2', 'hi-relaxed-1'],
    tags: ['bollywood', 'romantic', 'ballad'],
    description: 'A soulful ballad performed by Arijit Singh that became an instant classic. The minimal instrumentation allows Singh\'s emotional vocal delivery to shine through.'
  },
  {
    id: 'hi-calm-2',
    title: 'Luka Chuppi',
    artist: 'A.R. Rahman, Lata Mangeshkar',
    album: 'Rang De Basanti',
    releaseDate: '2006-01-26',
    language: 'hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738b8c6599d46f8c4580379c2f',
    duration: '5:35',
    spotifyUrl: 'https://open.spotify.com/track/3X0K547Xv86304SldRTKBF',
    similarSongs: ['hi-calm-1', 'hi-relaxed-2'],
    tags: ['soundtrack', 'emotional', 'classical'],
    description: 'A hauntingly beautiful composition by A.R. Rahman featuring the legendary Lata Mangeshkar and Prasoon Joshi. The song conveys a mother\'s emotions for her child with delicate instrumentation.'
  },

  // RELAXED - English Songs
  {
    id: 'en-relaxed-1',
    title: 'Landslide',
    artist: 'Fleetwood Mac',
    album: 'Fleetwood Mac',
    releaseDate: '1975-07-11',
    language: 'english',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e52a59a28efa4d1b6e070b33',
    duration: '3:19',
    spotifyUrl: 'https://open.spotify.com/track/5ihS6UUlyQAfmp8sAQnQgQ',
    similarSongs: ['en-relaxed-2', 'en-calm-2'],
    tags: ['folk', 'classic rock', 'acoustic'],
    description: 'Stevie Nicks\' introspective lyrics and the simple guitar accompaniment create a timeless folk-rock ballad about life\'s changes and relationships.'
  },
  {
    id: 'en-relaxed-2',
    title: 'Holocene',
    artist: 'Bon Iver',
    album: 'Bon Iver',
    releaseDate: '2011-06-17',
    language: 'english',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273104a06ec627a3e76517a8f2a',
    duration: '5:37',
    spotifyUrl: 'https://open.spotify.com/track/3TZrEkZ0kcs36MJIaTnHtH',
    similarSongs: ['en-relaxed-1', 'en-moderate-1'],
    tags: ['indie folk', 'atmospheric', 'winter'],
    description: 'A hauntingly beautiful track with layered instrumentation and Justin Vernon\'s distinctive falsetto vocals, creating a reflective and immersive listening experience.'
  },

  // RELAXED - Hindi Songs
  {
    id: 'hi-relaxed-1',
    title: 'Agar Tum Saath Ho',
    artist: 'Arijit Singh, Alka Yagnik',
    album: 'Tamasha',
    releaseDate: '2015-11-04',
    language: 'hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273241e7a06e7f66145a5777d24',
    duration: '5:41',
    spotifyUrl: 'https://open.spotify.com/track/4E5P1XyAFtrjpiIxkydly4',
    similarSongs: ['hi-calm-1', 'hi-relaxed-2'],
    tags: ['bollywood', 'emotional', 'duet'],
    description: 'A.R. Rahman\'s soulful composition performed by Arijit Singh and Alka Yagnik. The song\'s emotional depth is enhanced by the mellow instrumentation and heartfelt vocals.'
  },
  {
    id: 'hi-relaxed-2',
    title: 'Kabira',
    artist: 'Arijit Singh, Harshdeep Kaur',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-28',
    language: 'hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e0b702162552f71ba6ce7111',
    duration: '3:43',
    spotifyUrl: 'https://open.spotify.com/track/2KGxABXWDYuykkSQdhtj8G',
    similarSongs: ['hi-relaxed-1', 'hi-moderate-1'],
    tags: ['bollywood', 'melodic', 'philosophical'],
    description: 'A melodious track with philosophical undertones, featuring the complementary voices of Arijit Singh and Harshdeep Kaur. The acoustic arrangement gives it a relaxed, introspective feel.'
  },

  // MODERATE - English Songs
  {
    id: 'en-moderate-1',
    title: 'Redbone',
    artist: 'Childish Gambino',
    album: 'Awaken, My Love!',
    releaseDate: '2016-12-02',
    language: 'english',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273cf45fe60c0e2c9774f8d605f',
    duration: '5:26',
    spotifyUrl: 'https://open.spotify.com/track/3kxfsdsCpFgN412fpnW85Y',
    similarSongs: ['en-moderate-2', 'en-upbeat-1'],
    tags: ['funk', 'psychedelic', 'soul'],
    description: 'A psychedelic soul and funk track with a distinctive groove, falsetto vocals, and layered instrumentation that creates a hypnotic atmosphere with subtle intensity.'
  },
  {
    id: 'en-moderate-2',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    album: 'Rumours',
    releaseDate: '1977-02-04',
    language: 'english',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e52a59a28efa4d1b6e070b33',
    duration: '4:14',
    spotifyUrl: 'https://open.spotify.com/track/0ofHAoxe9vBkTCp2UQIavz',
    similarSongs: ['en-moderate-1', 'en-relaxed-1'],
    tags: ['classic rock', 'pop rock', 'mellow'],
    description: 'A timeless hit with a distinctive drum pattern and rhythm section that creates a moderate groove, while Stevie Nicks\' vocals add a dreamy quality to the track.'
  },

  // MODERATE - Hindi Songs
  {
    id: 'hi-moderate-1',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    language: 'hindi',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ca79f6b7fea4e3628ed5fe0e',
    duration: '4:49',
    spotifyUrl: 'https://open.spotify.com/track/2XzINNCfwR7dLqTvq3r6TH',
    similarSongs: ['hi-moderate-2', 'hi-relaxed-1'],
    tags: ['bollywood', 'romantic', 'classical elements'],
    description: 'Pritam\'s composition sung by Arijit Singh blends traditional Indian instruments with contemporary production. The song builds from a subtle beginning to an emotionally powerful chorus.'
  },
  {
    id: 'hi-moderate-2',
    title: 'Zinda',
    artist: 'Siddharth Mahadevan',
    album: 'Bhaag Milkha Bhaag',
    releaseDate: '2013-07-12',
    language: 'hindi',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273fa3baa8a3baa1b7a4f111f6c',
    duration: '3:34',
    spotifyUrl: 'https://open.spotify.com/track/5Qla2Sy0MzojX8JpC4ALCE',
    similarSongs: ['hi-moderate-1', 'hi-upbeat-1'],
    tags: ['motivational', 'soundtrack', 'rock elements'],
    description: 'A motivational track composed by Shankar-Ehsaan-Loy with a steady buildup and inspirational lyrics. The rock influences and powerful vocals create an energizing yet controlled atmosphere.'
  },

  // UPBEAT - English Songs
  {
    id: 'en-upbeat-1',
    title: 'Uptown Funk',
    artist: 'Mark Ronson, Bruno Mars',
    album: 'Uptown Special',
    releaseDate: '2015-01-13',
    language: 'english',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732d1cc72baed56923eae58e75',
    duration: '4:30',
    spotifyUrl: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
    similarSongs: ['en-upbeat-2', 'en-energetic-1'],
    tags: ['funk', 'pop', 'dance'],
    description: 'A catchy, funk-inspired hit with a prominent horn section, groovy bass line, and Bruno Mars\' charismatic vocals, creating an instantly recognizable dance track.'
  },
  {
    id: 'en-upbeat-2',
    title: 'Feel Good Inc.',
    artist: 'Gorillaz',
    album: 'Demon Days',
    releaseDate: '2005-05-09',
    language: 'english',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273029511e2c9328b5a1f8ff4b2',
    duration: '3:41',
    spotifyUrl: 'https://open.spotify.com/track/0d28khcov6AiegSCpG5TuT',
    similarSongs: ['en-upbeat-1', 'en-moderate-1'],
    tags: ['alternative', 'hip hop', 'electronic'],
    description: 'A genre-blending track that combines hip-hop beats, electronic elements, and alternative rock sensibilities, creating an infectious groove with distinct sections.'
  },

  // UPBEAT - Hindi Songs
  {
    id: 'hi-upbeat-1',
    title: 'London Thumakda',
    artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar',
    album: 'Queen',
    releaseDate: '2014-02-07',
    language: 'hindi',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e673c9acbfa956bdb38b2d32',
    duration: '3:23',
    spotifyUrl: 'https://open.spotify.com/track/5uieCZSJq1XQGV33VGisQd',
    similarSongs: ['hi-upbeat-2', 'hi-energetic-1'],
    tags: ['bollywood', 'wedding', 'dance'],
    description: 'A vibrant wedding song with a catchy dhol beat and energetic vocals. Its cheerful rhythm and playful lyrics make it perfect for celebrations and dance floors.'
  },
  {
    id: 'hi-upbeat-2',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal, Shefali Alvares',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-28',
    language: 'hindi',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e0b702162552f71ba6ce7111',
    duration: '3:45',
    spotifyUrl: 'https://open.spotify.com/track/6vqIFc9viICqz4Vf2OuknJ',
    similarSongs: ['hi-upbeat-1', 'hi-energetic-2'],
    tags: ['bollywood', 'dance', 'romance'],
    description: 'A playful and energetic song with catchy beats and a modern sound. Benny Dayal\'s spirited vocals and the dynamic orchestration create a perfect dance track.'
  },

  // ENERGETIC - English Songs
  {
    id: 'en-energetic-1',
    title: 'Don\'t Stop Me Now',
    artist: 'Queen',
    album: 'Jazz',
    releaseDate: '1979-01-26',
    language: 'english',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27348073abd3d39e74f6a2c7fb1',
    duration: '3:29',
    spotifyUrl: 'https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i',
    similarSongs: ['en-energetic-2', 'en-upbeat-1'],
    tags: ['rock', 'classic', 'anthem'],
    description: 'A high-energy rock anthem with Freddie Mercury\'s powerful vocals, driving piano, and an uplifting message. The relentless pace and dynamic instrumentation make it a timeless motivational track.'
  },
  {
    id: 'en-energetic-2',
    title: 'Stronger',
    artist: 'Kanye West',
    album: 'Graduation',
    releaseDate: '2007-09-11',
    language: 'english',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273dfcb8c756e2c659accc7d452',
    duration: '5:11',
    spotifyUrl: 'https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3',
    similarSongs: ['en-energetic-1', 'en-upbeat-2'],
    tags: ['hip hop', 'electronic', 'workout'],
    description: 'A powerhouse track sampling Daft Punk with driving electronic beats and confident lyrics. The combination of hip-hop and electronic elements creates a high-energy atmosphere perfect for workouts.'
  },

  // ENERGETIC - Hindi Songs
  {
    id: 'hi-energetic-1',
    title: 'Dhoom Machale',
    artist: 'Sunidhi Chauhan',
    album: 'Dhoom',
    releaseDate: '2004-08-27',
    language: 'hindi',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734a9d9c4cba97cf4e3d0c4ad7',
    duration: '3:48',
    spotifyUrl: 'https://open.spotify.com/track/2VwO9qzA2xr3gQiZA50YGW',
    similarSongs: ['hi-energetic-2', 'hi-upbeat-1'],
    tags: ['bollywood', 'dance', 'action'],
    description: 'The high-octane title track from the action film Dhoom. Sunidhi Chauhan\'s powerful vocals combined with the pulsating beats and dynamic production create an adrenaline-pumping experience.'
  },
  {
    id: 'hi-energetic-2',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    album: 'Bajirao Mastani',
    releaseDate: '2015-12-18',
    language: 'hindi',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27399602acb9ffec9c1cf9e8bae',
    duration: '3:32',
    spotifyUrl: 'https://open.spotify.com/track/4BFrPQcUkWgQBgX3DuFg33',
    similarSongs: ['hi-energetic-1', 'hi-upbeat-2'],
    tags: ['bollywood', 'celebration', 'traditional'],
    description: 'A powerful victory celebration song with intense dhol beats, traditional instruments, and Vishal Dadlani\'s energetic vocals. The song combines classical elements with modern production for maximum impact.'
  }
];

// Helper function to get songs by category
export const getSongsByCategory = (category: SongCategory, language?: 'english' | 'hindi'): Song[] => {
  if (language) {
    return songDatabase.filter(song => song.category === category && song.language === language);
  }
  return songDatabase.filter(song => song.category === category);
};

// Helper function to get similar songs
export const getSimilarSongs = (songId: string, limit: number = 3): Song[] => {
  const song = songDatabase.find(s => s.id === songId);
  if (!song || !song.similarSongs) return [];
  
  return song.similarSongs
    .map(id => songDatabase.find(s => s.id === id))
    .filter(Boolean) as Song[];
};

// Helper function to get random songs from a category
export const getRandomSongsByCategory = (
  category: SongCategory, 
  count: number = 3, 
  language?: 'english' | 'hindi'
): Song[] => {
  const songs = getSongsByCategory(category, language);
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get recommendations based on fuzzy parameters
export const getRecommendedSongs = (
  params: MoodParams, 
  count: number = 5,
  includeEnglish: boolean = true,
  includeHindi: boolean = true
): Song[] => {
  const { category, memberships } = determineSongCategory(params);
  
  let songs: Song[] = [];
  let languages: ('english' | 'hindi')[] = [];
  
  if (includeEnglish) languages.push('english');
  if (includeHindi) languages.push('hindi');
  
  // Get songs from primary category
  const primarySongs = songDatabase.filter(
    song => song.category === category && languages.includes(song.language)
  );
  
  // If we don't have enough, get songs from other categories based on membership strength
  if (primarySongs.length < count) {
    // Sort categories by membership value
    const sortedCategories = Object.entries(memberships)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat as SongCategory)
      .filter(cat => cat !== category);
    
    // Add songs from other categories
    for (const cat of sortedCategories) {
      const additionalSongs = songDatabase.filter(
        song => song.category === cat && languages.includes(song.language)
      );
      
      songs = [...primarySongs, ...additionalSongs];
      if (songs.length >= count) break;
    }
  } else {
    songs = primarySongs;
  }
  
  // Shuffle and limit
  return [...songs].sort(() => 0.5 - Math.random()).slice(0, count);
};
