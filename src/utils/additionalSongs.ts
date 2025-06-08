
import { SongCategory } from './fuzzyLogic';

// Additional songs to expand the database to 100+ records
export const additionalSongs = [
  // More CALM English Songs (15 additional)
  {
    id: 'en-calm-15',
    title: 'Mad World',
    artist: 'Gary Jules',
    album: 'Trading Snakeoil for Wolftickets',
    releaseDate: '2001-05-01',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f',
    duration: '3:07',
    spotifyUrl: 'https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP',
    tags: ['melancholic', 'acoustic', 'cover'],
    description: 'A haunting acoustic cover transforming the original into an introspective piece.'
  },
  {
    id: 'en-calm-16',
    title: 'Breathe Me',
    artist: 'Sia',
    album: '1000 Forms of Fear',
    releaseDate: '2014-07-04',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273cd2bb76c98813c3cf0d60d09',
    duration: '4:32',
    spotifyUrl: 'https://open.spotify.com/track/4sBwFXFllBfOzFYjmRhBYD',
    tags: ['emotional', 'vulnerable', 'piano'],
    description: 'A vulnerable ballad showcasing Sia\'s emotional range and powerful vocals.'
  },
  {
    id: 'en-calm-17',
    title: 'Hurt',
    artist: 'Johnny Cash',
    album: 'American IV: The Man Comes Around',
    releaseDate: '2002-11-05',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273912ed19536068c1fc2e5ab0a',
    duration: '3:38',
    spotifyUrl: 'https://open.spotify.com/track/2EuIV2gDeGaAqFucHXcWIa',
    tags: ['country', 'cover', 'emotional'],
    description: 'Johnny Cash\'s haunting cover filled with raw emotion and vulnerability.'
  },
  {
    id: 'en-calm-18',
    title: 'Hallelujah',
    artist: 'Jeff Buckley',
    album: 'Grace',
    releaseDate: '1994-08-23',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738c9bb82e3e8c7dab32b9a524',
    duration: '6:53',
    spotifyUrl: 'https://open.spotify.com/track/2mKkYGXqiXMzweSdEsglNK',
    tags: ['alternative rock', 'spiritual', 'cover'],
    description: 'A transcendent cover showcasing Buckley\'s ethereal vocals.'
  },
  {
    id: 'en-calm-19',
    title: 'The Sound of Silence',
    artist: 'Simon & Garfunkel',
    album: 'Sounds of Silence',
    releaseDate: '1965-10-11',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a3b05b5ab69c67c79cb5c738',
    duration: '3:05',
    spotifyUrl: 'https://open.spotify.com/track/0z9KEXgsVrHSJrE3XtOhBH',
    tags: ['folk', 'classic', 'introspective'],
    description: 'A timeless folk classic about isolation and communication.'
  },
  {
    id: 'en-calm-20',
    title: 'Tears in Heaven',
    artist: 'Eric Clapton',
    album: 'Unplugged',
    releaseDate: '1992-08-25',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b2b2747c89d68d5330e0d735',
    duration: '4:32',
    spotifyUrl: 'https://open.spotify.com/track/4bHsxqR3GMBJdDQEGYvZXh',
    tags: ['acoustic', 'emotional', 'ballad'],
    description: 'A deeply personal and emotional acoustic ballad.'
  },
  {
    id: 'en-calm-21',
    title: 'Skinny Love',
    artist: 'Bon Iver',
    album: 'For Emma, Forever Ago',
    releaseDate: '2007-07-20',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273aa5ac0e512c1743cf4b47506',
    duration: '3:58',
    spotifyUrl: 'https://open.spotify.com/track/01XJJELGNFPFnp7HLm6R3F',
    tags: ['indie folk', 'falsetto', 'intimate'],
    description: 'An intimate falsetto performance with minimal instrumentation.'
  },
  {
    id: 'en-calm-22',
    title: 'River',
    artist: 'Joni Mitchell',
    album: 'Blue',
    releaseDate: '1971-06-22',
    language: 'English' as const,
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b2b2747c89d68d5330e0d735',
    duration: '4:00',
    spotifyUrl: 'https://open.spotify.com/track/4fzZgBXQQADAzYNAWr8dBV',
    tags: ['folk', 'melancholic', 'piano'],
    description: 'A melancholic reflection with beautiful piano and poetic lyrics.'
  }
];

// Additional Hindi songs
export const additionalHindiSongs = [
  {
    id: 'hi-calm-14',
    title: 'Tere Naam',
    artist: 'Udit Narayan, Alka Yagnik',
    album: 'Tere Naam',
    releaseDate: '2003-08-15',
    language: 'Hindi' as const,
    category: SongCategory.CALM,
    coverImage: 'https://c.saavncdn.com/788/Tere-Naam-Hindi-2003-20190702102239-500x500.jpg',
    duration: '5:15',
    spotifyUrl: 'https://open.spotify.com/track/4mCKLy2k3qU7p8xLQqV5xQ',
    tags: ['bollywood', 'romantic', 'emotional'],
    description: 'A deeply emotional love ballad from the classic Bollywood film.'
  },
  {
    id: 'hi-calm-15',
    title: 'Moh Moh Ke Dhaage',
    artist: 'Monali Thakur',
    album: 'Dum Laga Ke Haisha',
    releaseDate: '2015-02-27',
    language: 'Hindi' as const,
    category: SongCategory.CALM,
    coverImage: 'https://c.saavncdn.com/364/Dum-Laga-Ke-Haisha-Hindi-2015-500x500.jpg',
    duration: '4:28',
    spotifyUrl: 'https://open.spotify.com/track/5qI8ZdrtP3pI8V9g9Dd9qX',
    tags: ['bollywood', 'romantic', 'soulful'],
    description: 'A beautiful romantic song with contemporary arrangements.'
  },
  {
    id: 'hi-calm-16',
    title: 'Kabira',
    artist: 'Tochi Raina, Rekha Bhardwaj',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-31',
    language: 'Hindi' as const,
    category: SongCategory.CALM,
    coverImage: 'https://c.saavncdn.com/171/Yeh-Jawaani-Hai-Deewani-Hindi-2013-500x500.jpg',
    duration: '4:17',
    spotifyUrl: 'https://open.spotify.com/track/1t9rOF7OZDa5ojeL1iEhVN',
    tags: ['bollywood', 'philosophical', 'acoustic'],
    description: 'A philosophical song with beautiful acoustic arrangements.'
  },
  {
    id: 'hi-calm-17',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    language: 'Hindi' as const,
    category: SongCategory.CALM,
    coverImage: 'https://c.saavncdn.com/742/Ae-Dil-Hai-Mushkil-Hindi-2016-500x500.jpg',
    duration: '4:28',
    spotifyUrl: 'https://open.spotify.com/track/2EJM8ZnBFjJ8nxmhgj7cON',
    tags: ['bollywood', 'heartbreak', 'emotional'],
    description: 'A heart-wrenching ballad about the pain of unrequited love.'
  }
];

// Additional Relaxed songs
export const additionalRelaxedSongs = [
  {
    id: 'en-relaxed-6',
    title: 'Mad About You',
    artist: 'Sting',
    album: 'Ten Summoner\'s Tales',
    releaseDate: '1993-03-09',
    language: 'English' as const,
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2730f6ca1e92db0b1e1b6e1ecfc',
    duration: '3:53',
    spotifyUrl: 'https://open.spotify.com/track/4N5DaZNTwSd3wUIZP9lTKN',
    tags: ['alternative rock', 'jazz', 'romantic'],
    description: 'A smooth blend of rock and jazz elements with romantic themes.'
  },
  {
    id: 'en-relaxed-7',
    title: 'Wonderwall',
    artist: 'Oasis',
    album: '(What\'s the Story) Morning Glory?',
    releaseDate: '1995-10-02',
    language: 'English' as const,
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2731b0b1f3b16f7b1c3e1a1a1a1',
    duration: '4:19',
    spotifyUrl: 'https://open.spotify.com/track/5wTNQa01o2Y7VQopExR7HW',
    tags: ['britpop', 'alternative rock', 'anthem'],
    description: 'An iconic Britpop anthem with memorable melodies.'
  },
  {
    id: 'en-relaxed-8',
    title: 'Creep',
    artist: 'Radiohead',
    album: 'Pablo Honey',
    releaseDate: '1992-09-21',
    language: 'English' as const,
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2736cf9b0893284e0c3bb9d7c67',
    duration: '3:58',
    spotifyUrl: 'https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r',
    tags: ['alternative rock', 'grunge', 'melancholic'],
    description: 'A melancholic alternative rock classic with raw emotion.'
  }
];

// Additional Moderate songs
export const additionalModerateSongs = [
  {
    id: 'en-moderate-5',
    title: 'Brown Eyed Girl',
    artist: 'Van Morrison',
    album: 'Blowin\' Your Mind!',
    releaseDate: '1967-09-30',
    language: 'English' as const,
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a1a2f9ef42c94cdca25813e4',
    duration: '3:05',
    spotifyUrl: 'https://open.spotify.com/track/3eekarcy7kvN4yt5ZFzltW',
    tags: ['classic rock', 'feel good', 'nostalgic'],
    description: 'A nostalgic feel-good classic with uplifting vibes.'
  },
  {
    id: 'en-moderate-6',
    title: 'Three Little Birds',
    artist: 'Bob Marley & The Wailers',
    album: 'Exodus',
    releaseDate: '1977-06-03',
    language: 'English' as const,
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273085c9725c1bb4d3a0d4ee12b',
    duration: '3:00',
    spotifyUrl: 'https://open.spotify.com/track/6JV2JOEocMgcZxYSZelKcc',
    tags: ['reggae', 'positive', 'classic'],
    description: 'A timeless reggae classic with a positive message.'
  },
  {
    id: 'en-moderate-7',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    releaseDate: '1987-07-21',
    language: 'English' as const,
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a9c4d2ec4d8e1d7f5c5b9a4d',
    duration: '5:03',
    spotifyUrl: 'https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51',
    tags: ['hard rock', 'classic', 'guitar'],
    description: 'A classic hard rock anthem with iconic guitar work.'
  }
];

// Additional Upbeat songs
export const additionalUpbeatSongs = [
  {
    id: 'en-upbeat-6',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    releaseDate: '2014-11-10',
    language: 'English' as const,
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f25c4c4b748bd47b369dd3b3',
    duration: '4:30',
    spotifyUrl: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
    tags: ['funk', 'pop', 'dance'],
    description: 'A funk-infused pop hit that\'s impossible not to dance to.'
  },
  {
    id: 'en-upbeat-7',
    title: 'I Gotta Feeling',
    artist: 'The Black Eyed Peas',
    album: 'The E.N.D.',
    releaseDate: '2009-05-21',
    language: 'English' as const,
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e5e5dc4f7f8cd8c800c19bc4',
    duration: '4:49',
    spotifyUrl: 'https://open.spotify.com/track/2ZWlPOoWh0626oTaHrnl2a',
    tags: ['dance pop', 'electronic', 'party'],
    description: 'An infectious party anthem with electronic dance beats.'
  },
  {
    id: 'en-upbeat-8',
    title: 'Happy',
    artist: 'Pharrell Williams',
    album: 'G I R L',
    releaseDate: '2013-11-21',
    language: 'English' as const,
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e13de7b8662b085b0885ffef',
    duration: '3:53',
    spotifyUrl: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
    tags: ['pop', 'feel good', 'uplifting'],
    description: 'An irresistibly happy and uplifting pop anthem.'
  }
];

// Additional Energetic songs
export const additionalEnergeticSongs = [
  {
    id: 'en-energetic-6',
    title: 'We Will Rock You',
    artist: 'Queen',
    album: 'News of the World',
    releaseDate: '1977-10-07',
    language: 'English' as const,
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734637341b9f507521afa9a778',
    duration: '2:02',
    spotifyUrl: 'https://open.spotify.com/track/4pbJqGIASGPr0ZpGpnWkDn',
    tags: ['rock', 'anthemic', 'stadium'],
    description: 'The ultimate stadium anthem with iconic stomp-stomp-clap rhythm.'
  },
  {
    id: 'en-energetic-7',
    title: 'Don\'t Stop Me Now',
    artist: 'Queen',
    album: 'Jazz',
    releaseDate: '1978-10-13',
    language: 'English' as const,
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273aa5ac0e512c1743cf4b47506',
    duration: '3:29',
    spotifyUrl: 'https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7',
    tags: ['rock', 'feel good', 'euphoric'],
    description: 'An exuberant celebration of life with soaring vocals and piano.'
  },
  {
    id: 'en-energetic-8',
    title: 'Livin\' on a Prayer',
    artist: 'Bon Jovi',
    album: 'Slippery When Wet',
    releaseDate: '1986-08-18',
    language: 'English' as const,
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273025c4e7c5d3d9f8c41b06da1',
    duration: '4:09',
    spotifyUrl: 'https://open.spotify.com/track/37ZJ0p5Jm13JPevGcx4SkF',
    tags: ['rock', 'anthemic', 'classic'],
    description: 'An anthemic rock classic with powerful vocals and energy.'
  }
];
