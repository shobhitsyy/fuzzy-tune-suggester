

import { Song } from './fuzzyLogic';

export const additionalSongs: Song[] = [
  // English Calm Songs
  {
    id: 'en-calm-1',
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Weightless',
    duration: '8:08',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f7b3bdd271c7b7b0b1c3b5a8',
    language: 'English',
    tags: ['ambient', 'relaxation', 'sleep'],
    releaseDate: '2011-10-17',
    spotifyUrl: 'https://open.spotify.com/track/4LmSdvGF5LENgJNlqJRr8z',
    description: 'Scientifically designed to reduce anxiety by 65%.'
  },
  {
    id: 'en-calm-2',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    album: 'Suite bergamasque',
    duration: '5:00',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b9c0a9b0e0a8b7c9d8e0f1',
    language: 'English',
    tags: ['classical', 'piano', 'peaceful'],
    releaseDate: '1905-01-01',
    spotifyUrl: 'https://open.spotify.com/track/2IznKQ1tFd3y6YWYdAk5d8',
    description: 'A beautiful and serene classical piano piece.'
  },
  {
    id: 'en-calm-3',
    title: 'River',
    artist: 'Joni Mitchell',
    album: 'Blue',
    duration: '4:00',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b9c8e0a9b0e0a8b7c9d8e0f2',
    language: 'English',
    tags: ['folk', 'acoustic', 'melancholic'],
    releaseDate: '1971-06-22',
    spotifyUrl: 'https://open.spotify.com/track/4iq6o5ojgK1JXDTQEvtT1Y',
    description: 'A contemplative folk song about longing and solitude.'
  },

  // English Relaxed Songs
  {
    id: 'en-relaxed-1',
    title: 'Mad World',
    artist: 'Gary Jules',
    album: 'Trading Snakeoil for Wolftickets',
    duration: '3:07',
    category: 'RELAXED',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273c9d8e0a9b0e0a8b7c9d8e0f3',
    language: 'English',
    tags: ['alternative', 'melancholic', 'cover'],
    releaseDate: '2001-10-01',
    spotifyUrl: 'https://open.spotify.com/track/4PiRKlXCOk2VjGjJjL8VtR',
    description: 'A haunting cover of Tears for Fears original.'
  },
  {
    id: 'en-relaxed-2',
    title: 'Holocene',
    artist: 'Bon Iver',
    album: 'Bon Iver, Bon Iver',
    duration: '5:36',
    category: 'RELAXED',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273d9e0a9b0e0a8b7c9d8e0f4a5',
    language: 'English',
    tags: ['indie folk', 'atmospheric', 'introspective'],
    releaseDate: '2011-06-17',
    spotifyUrl: 'https://open.spotify.com/track/5za8RnalIoFl1PbJGrLZqI',
    description: 'An atmospheric indie folk song about self-reflection.'
  },

  // English Moderate Songs
  {
    id: 'en-moderate-1',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    album: 'Strange Trails',
    duration: '3:28',
    category: 'MODERATE',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e9f0a9b0e0a8b7c9d8e0f5b6',
    language: 'English',
    tags: ['indie folk', 'nostalgic', 'acoustic'],
    releaseDate: '2015-04-07',
    spotifyUrl: 'https://open.spotify.com/track/7uF7bb7z8yEzT8jT4kd0MD',
    description: 'A nostalgic indie folk ballad about lost love.'
  },
  {
    id: 'en-moderate-2',
    title: 'Somebody That I Used to Know',
    artist: 'Gotye',
    album: 'Making Mirrors',
    duration: '4:04',
    category: 'MODERATE',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f9g0a9b0e0a8b7c9d8e0f6c7',
    language: 'English',
    tags: ['indie pop', 'breakup', 'electronic'],
    releaseDate: '2011-07-05',
    spotifyUrl: 'https://open.spotify.com/track/2EjZKkjV9EvjPEiW5aeajN',
    description: 'A melancholic indie pop song about moving on from a relationship.'
  },

  // English Upbeat Songs
  {
    id: 'en-upbeat-1',
    title: 'Walking on Sunshine',
    artist: 'Katrina and the Waves',
    album: 'Walking on Sunshine',
    duration: '3:59',
    category: 'UPBEAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273g9h0a9b0e0a8b7c9d8e0f7d8',
    language: 'English',
    tags: ['pop rock', 'uplifting', '80s'],
    releaseDate: '1985-05-10',
    spotifyUrl: 'https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeAC',
    description: 'An uplifting pop rock anthem about feeling great.'
  },
  {
    id: 'en-upbeat-2',
    title: 'Good as Hell',
    artist: 'Lizzo',
    album: 'Cuz I Love You',
    duration: '2:39',
    category: 'UPBEAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273h9i0a9b0e0a8b7c9d8e0f8e9',
    language: 'English',
    tags: ['pop', 'empowering', 'feel-good'],
    releaseDate: '2019-04-19',
    spotifyUrl: 'https://open.spotify.com/track/1WkMMavIMc4JZ8cfMmxHkI',
    description: 'An empowering pop anthem about self-confidence.'
  },

  // English Energetic Songs
  {
    id: 'en-energetic-1',
    title: 'Pumped Up Kicks',
    artist: 'Foster the People',
    album: 'Torches',
    duration: '3:59',
    category: 'ENERGETIC',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273i9j0a9b0e0a8b7c9d8e0f9fa',
    language: 'English',
    tags: ['indie pop', 'electronic', 'catchy'],
    releaseDate: '2010-09-14',
    spotifyUrl: 'https://open.spotify.com/track/7w87IxuO7BDcJ3YUqCyMTT',
    description: 'A catchy indie pop song with electronic elements.'
  },
  {
    id: 'en-energetic-2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    category: 'ENERGETIC',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273j9k0a9b0e0a8b7c9d8e0gafb',
    language: 'English',
    tags: ['pop', 'disco', 'dance'],
    releaseDate: '2020-03-27',
    spotifyUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
    description: 'A disco-influenced pop song perfect for dancing.'
  },

  // Hindi Calm Songs
  {
    id: 'hi-calm-13',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman',
    album: 'Rockstar',
    duration: '7:52',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273k9l0a9b0e0a8b7c9d8e0hbgc',
    language: 'Hindi',
    tags: ['sufi', 'spiritual', 'devotional'],
    releaseDate: '2011-09-30',
    spotifyUrl: 'https://open.spotify.com/track/5vIkG9SbG3LI9i0lj85WpZ',
    description: 'A beautiful Sufi song about divine love and surrender.'
  },
  {
    id: 'hi-calm-14',
    title: 'Shayad',
    artist: 'Arijit Singh',
    album: 'Love Aaj Kal',
    duration: '3:18',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273l9m0a9b0e0a8b7c9d8e0ichd',
    language: 'Hindi',
    tags: ['romantic', 'melancholic', 'modern'],
    releaseDate: '2020-01-17',
    spotifyUrl: 'https://open.spotify.com/track/4JcoqZjZ9KuS9JJQqQHOe2',
    description: 'A tender romantic ballad about uncertain love.'
  },

  // Hindi Relaxed Songs
  {
    id: 'hi-relaxed-5',
    title: 'Pasoori',
    artist: 'Ali Sethi',
    album: 'Coke Studio Season 14',
    duration: '4:03',
    category: 'RELAXED',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273m9n0a9b0e0a8b7c9d8e0jdie',
    language: 'Hindi',
    tags: ['punjabi', 'contemporary', 'fusion'],
    releaseDate: '2022-02-03',
    spotifyUrl: 'https://open.spotify.com/track/2PvKoyLnfqjzR2XvxuOZZy',
    description: 'A contemporary Punjabi fusion hit with soulful vocals.'
  },
  {
    id: 'hi-relaxed-6',
    title: 'Mere Naam Tu',
    artist: 'Abhay Jodhpurkar',
    album: 'Zero',
    duration: '4:28',
    category: 'RELAXED',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273n9o0a9b0e0a8b7c9d8e0kejf',
    language: 'Hindi',
    tags: ['romantic', 'soft', 'melodic'],
    releaseDate: '2018-11-09',
    spotifyUrl: 'https://open.spotify.com/track/1rqqVE6MZDwOHgMkzP7FTJ',
    description: 'A soft romantic melody about love and devotion.'
  },

  // Hindi Moderate Songs
  {
    id: 'hi-moderate-5',
    title: 'Kabira',
    artist: 'Tochi Raina',
    album: 'Yeh Jawaani Hai Deewani',
    duration: '4:18',
    category: 'MODERATE',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273o9p0a9b0e0a8b7c9d8e0lfkg',
    language: 'Hindi',
    tags: ['sufi', 'philosophical', 'acoustic'],
    releaseDate: '2013-05-19',
    spotifyUrl: 'https://open.spotify.com/track/7cKNbSrMBR3pV8OpH2lEXt',
    description: 'A philosophical Sufi song about lifes journey.'
  },
  {
    id: 'hi-moderate-6',
    title: 'Raabta',
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: '4:05',
    category: 'MODERATE',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273p9q0a9b0e0a8b7c9d8e0mglh',
    language: 'Hindi',
    tags: ['romantic', 'soulful', 'connection'],
    releaseDate: '2012-03-15',
    spotifyUrl: 'https://open.spotify.com/track/0D14SaZEDnPzm3qp4FJKoZ',
    description: 'A soulful song about deep emotional connections.'
  },

  // Hindi Upbeat Songs
  {
    id: 'hi-upbeat-5',
    title: 'Gallan Goodiyaan',
    artist: 'Yashita Sharma, Manish Kumar Tipu',
    album: 'Dil Dhadakne Do',
    duration: '4:23',
    category: 'UPBEAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273q9r0a9b0e0a8b7c9d8e0nhmi',
    language: 'Hindi',
    tags: ['punjabi', 'celebration', 'wedding'],
    releaseDate: '2015-04-15',
    spotifyUrl: 'https://open.spotify.com/track/0ZfvCr35kODCkU36FUIpU0',
    description: 'An energetic Punjabi celebration song perfect for weddings.'
  },
  {
    id: 'hi-upbeat-6',
    title: 'Nagada Sang Dhol',
    artist: 'Shreya Ghoshal, Osman Mir',
    album: 'Goliyon Ki Raasleela Ram-Leela',
    duration: '4:57',
    category: 'UPBEAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273r9s0a9b0e0a8b7c9d8e0oinj',
    language: 'Hindi',
    tags: ['classical', 'dance', 'festive'],
    releaseDate: '2013-10-15',
    spotifyUrl: 'https://open.spotify.com/track/4UmqDBp1ZjF8QDfVL4a5md',
    description: 'A classical dance number with festive energy.'
  },

  // Hindi Energetic Songs
  {
    id: 'hi-energetic-5',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    album: 'Bajirao Mastani',
    duration: '3:12',
    category: 'ENERGETIC',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273s9t0a9b0e0a8b7c9d8e0pjok',
    language: 'Hindi',
    tags: ['powerful', 'warrior', 'motivational'],
    releaseDate: '2015-10-08',
    spotifyUrl: 'https://open.spotify.com/track/5ZFUvpN1CxhEw51lCOJjN2',
    description: 'A powerful warrior anthem with motivational energy.'
  },
  {
    id: 'hi-energetic-6',
    title: 'Apna Time Aayega',
    artist: 'Ranveer Singh, Divine',
    album: 'Gully Boy',
    duration: '3:04',
    category: 'ENERGETIC',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273t9u0a9b0e0a8b7c9d8e0qkpl',
    language: 'Hindi',
    tags: ['rap', 'motivational', 'street'],
    releaseDate: '2019-01-09',
    spotifyUrl: 'https://open.spotify.com/track/7tI8dRuH2Yc6RuoTjxo4aU',
    description: 'A motivational rap anthem about seizing opportunities.'
  },

  // Additional English Songs
  {
    id: 'en-calm-4',
    title: 'Mad World',
    artist: 'Tears for Fears',
    album: 'The Hurting',
    duration: '3:30',
    category: 'CALM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273u9v0a9b0e0a8b7c9d8e0rlqm',
    language: 'English',
    tags: ['new wave', 'melancholic', 'original'],
    releaseDate: '1982-09-12',
    spotifyUrl: 'https://open.spotify.com/track/4ccm8EXWl4wwpGmKiPClJH',
    description: 'The original version of the melancholic new wave classic.'
  },
  {
    id: 'en-relaxed-3',
    title: 'Skinny Love',
    artist: 'Bon Iver',
    album: 'For Emma, Forever Ago',
    duration: '3:58',
    category: 'RELAXED',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273v9w0a9b0e0a8b7c9d8e0smrn',
    language: 'English',
    tags: ['indie folk', 'falsetto', 'emotional'],
    releaseDate: '2007-07-20',
    spotifyUrl: 'https://open.spotify.com/track/4h97GHBmDYNlq5PJPjPXe2',
    description: 'An emotional indie folk song with haunting falsetto vocals.'
  },
  {
    id: 'en-moderate-3',
    title: 'High Hopes',
    artist: 'Panic! At The Disco',
    album: 'Pray for the Wicked',
    duration: '3:10',
    category: 'MODERATE',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273w9x0a9b0e0a8b7c9d8e0tnso',
    language: 'English',
    tags: ['pop rock', 'optimistic', 'anthem'],
    releaseDate: '2018-05-23',
    spotifyUrl: 'https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWJBuRL',
    description: 'An optimistic pop rock anthem about perseverance.'
  },
  {
    id: 'en-upbeat-3',
    title: 'Cant Stop the Feeling!',
    artist: 'Justin Timberlake',
    album: 'Trolls (Original Motion Picture Soundtrack)',
    duration: '3:56',
    category: 'UPBEAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273x9y0a9b0e0a8b7c9d8e0uotp',
    language: 'English',
    tags: ['pop', 'feel-good', 'dance'],
    releaseDate: '2016-05-06',
    spotifyUrl: 'https://open.spotify.com/track/6KuQTIu1KoTTkLXKWPJb0J',
    description: 'A feel-good pop dance track that will lift your spirits.'
  },
  {
    id: 'en-energetic-3',
    title: 'Thunder',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: '3:07',
    category: 'ENERGETIC',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273y9z0a9b0e0a8b7c9d8e0vpuq',
    language: 'English',
    tags: ['pop rock', 'electronic', 'powerful'],
    releaseDate: '2017-04-27',
    spotifyUrl: 'https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB',
    description: 'A powerful pop rock anthem with electronic elements.'
  }
];

