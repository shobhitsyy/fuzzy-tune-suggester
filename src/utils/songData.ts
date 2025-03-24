
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
  {
    id: 'en-calm-3',
    title: 'River Flows In You',
    artist: 'Yiruma',
    album: 'First Love',
    releaseDate: '2001-12-01',
    language: 'english',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732ff0b80c8c66ffcce8c0f380',
    duration: '3:11',
    spotifyUrl: 'https://open.spotify.com/track/4uihyQTBLSwZCnHFPoCj7c',
    similarSongs: ['en-calm-1', 'en-calm-2'],
    tags: ['piano', 'instrumental', 'peaceful'],
    description: 'A gentle piano composition that creates a serene, flowing atmosphere reminiscent of a peaceful river. This piece is often used for relaxation and meditation.'
  },
  {
    id: 'en-calm-4',
    title: 'Gymnopédie No.1',
    artist: 'Erik Satie',
    album: 'Gymnopédies',
    releaseDate: '1888-01-01',
    language: 'english',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f3a21b2f3d903e8d74f3c52c',
    duration: '3:05',
    spotifyUrl: 'https://open.spotify.com/track/5NGtFXVpXSvwunEIGeviY3',
    similarSongs: ['en-calm-3', 'en-calm-1'],
    tags: ['classical', 'piano', 'minimalist'],
    description: 'A timeless piano piece known for its gentle, melancholic melody and sparse, deliberate rhythm. Its minimalist approach creates a contemplative and calming atmosphere.'
  },
  {
    id: 'en-calm-5',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    album: 'Suite Bergamasque',
    releaseDate: '1905-01-01',
    language: 'english',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273756055fa37a9a3972a16b83a',
    duration: '5:01',
    spotifyUrl: 'https://open.spotify.com/track/5spQOVLHcONO7cj2JLoDrT',
    similarSongs: ['en-calm-4', 'en-calm-3'],
    tags: ['classical', 'piano', 'impressionist'],
    description: 'One of Debussy\'s most famous compositions, creating a dreamy, moonlit atmosphere through delicate piano phrases and subtle dynamic changes. The piece evokes a sense of quiet wonder.'
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
  {
    id: 'hi-calm-3',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    language: 'hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ca79f6b7fea4e3628ed5fe0e',
    duration: '4:29',
    spotifyUrl: 'https://open.spotify.com/track/4r3GHJQHHkxvXR18e9tKA7',
    similarSongs: ['hi-calm-1', 'hi-calm-2'],
    tags: ['bollywood', 'emotional', 'piano'],
    description: 'A melancholic ballad showcasing Arijit Singh\'s emotive vocals paired with a delicate piano arrangement. The song builds gradually, expressing the complexities of unrequited love.'
  },
  {
    id: 'hi-calm-4',
    title: 'Main Agar Kahoon',
    artist: 'Sonu Nigam, Shreya Ghoshal',
    album: 'Om Shanti Om',
    releaseDate: '2007-11-09',
    language: 'hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27361d3c75ccbdb4b43bc43843e',
    duration: '5:08',
    spotifyUrl: 'https://open.spotify.com/track/0vM3iPTLQgkFylQvHCn9jS',
    similarSongs: ['hi-calm-1', 'hi-calm-3'],
    tags: ['bollywood', 'romantic', 'duet'],
    description: 'A tender romantic duet featuring the complementary vocals of Sonu Nigam and Shreya Ghoshal. The orchestral arrangement creates a dreamy, nostalgic atmosphere.'
  },
  {
    id: 'hi-calm-5',
    title: 'Bol Na Halke Halke',
    artist: 'Rahat Fateh Ali Khan, Mahalakshmi Iyer',
    album: 'Jhoom Barabar Jhoom',
    releaseDate: '2007-06-15',
    language: 'hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8e1d724ab287a90fa8f4d28',
    duration: '5:10',
    spotifyUrl: 'https://open.spotify.com/track/6g6YfNvqZjyWeuFx0Vt7Zz',
    similarSongs: ['hi-calm-2', 'hi-calm-4'],
    tags: ['sufi', 'romantic', 'melodic'],
    description: 'A soothing Sufi-inspired composition with gentle percussion and the distinctive vocals of Rahat Fateh Ali Khan. The song creates a peaceful, intimate atmosphere with its measured pace.'
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
  {
    id: 'en-relaxed-3',
    title: 'Harvest Moon',
    artist: 'Neil Young',
    album: 'Harvest Moon',
    releaseDate: '1992-10-27',
    language: 'english',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273183a37f4dcaf8676fb3cfb5c',
    duration: '5:03',
    spotifyUrl: 'https://open.spotify.com/track/5LYJ631w9ps5h9tdvac7yP',
    similarSongs: ['en-relaxed-1', 'en-relaxed-2'],
    tags: ['folk rock', 'acoustic', 'romantic'],
    description: 'A warm, nostalgic love song with gentle acoustic guitar, brushed drums, and Neil Young\'s distinctive vocal delivery. The song evokes a sense of comfortable reminiscence and enduring affection.'
  },
  {
    id: 'en-relaxed-4',
    title: 'Skinny Love',
    artist: 'Bon Iver',
    album: 'For Emma, Forever Ago',
    releaseDate: '2008-02-19',
    language: 'english',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e787a712e92323f565fda47f',
    duration: '3:58',
    spotifyUrl: 'https://open.spotify.com/track/1mwt9hzaH7idmC5UCoOUkz',
    similarSongs: ['en-relaxed-2', 'en-relaxed-5'],
    tags: ['indie folk', 'acoustic', 'raw'],
    description: 'A raw, emotive track with stripped-back acoustic guitar and Justin Vernon\'s passionate vocal performance. The song\'s intimate production creates a sense of being in the room during the recording.'
  },
  {
    id: 'en-relaxed-5',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    album: 'Strange Trails',
    releaseDate: '2015-04-07',
    language: 'english',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738d3eb8cc9ee11a71c2c35297',
    duration: '3:28',
    spotifyUrl: 'https://open.spotify.com/track/3hRV0jL3vUpRrcy398teAU',
    similarSongs: ['en-relaxed-4', 'en-relaxed-3'],
    tags: ['indie folk', 'nostalgic', 'soundtrack'],
    description: 'A hauntingly nostalgic track with reverb-drenched vocals and a gentle, swaying rhythm. The melancholic lyrics and atmosphere create a sense of yearning for a past moment in time.'
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
  {
    id: 'hi-relaxed-3',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    album: 'Jab We Met',
    releaseDate: '2007-10-26',
    language: 'hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732c8d9b2a697291e2b8995e06',
    duration: '5:09',
    spotifyUrl: 'https://open.spotify.com/track/5EmrVzA7C5GhOJKxwsBZQP',
    similarSongs: ['hi-relaxed-2', 'hi-relaxed-4'],
    tags: ['bollywood', 'romantic', 'acoustic'],
    description: 'A gentle love song with Mohit Chauhan\'s warm vocals and a simple, acoustic-driven arrangement. The song\'s melody and pacing create a relaxed, dreamy atmosphere.'
  },
  {
    id: 'hi-relaxed-4',
    title: 'Jeena Jeena',
    artist: 'Atif Aslam',
    album: 'Badlapur',
    releaseDate: '2015-01-23',
    language: 'hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2731037a06d153b2359c5ae111f',
    duration: '3:50',
    spotifyUrl: 'https://open.spotify.com/track/0Vl6nQ13lFzq2HxS5RUj3g',
    similarSongs: ['hi-relaxed-3', 'hi-relaxed-5'],
    tags: ['bollywood', 'romantic', 'soothing'],
    description: 'A mellow romantic track showcasing Atif Aslam\'s distinctive vocal texture. The subtle instrumentation and unhurried pace create a comforting, intimate feeling.'
  },
  {
    id: 'hi-relaxed-5',
    title: 'Phir Se Ud Chala',
    artist: 'Mohit Chauhan',
    album: 'Rockstar',
    releaseDate: '2011-09-30',
    language: 'hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2737ff50b93aa1cb2efadb85d0b',
    duration: '4:25',
    spotifyUrl: 'https://open.spotify.com/track/6VMIB1Ty8xG1jRwZmHyqRs',
    similarSongs: ['hi-relaxed-3', 'hi-moderate-1'],
    tags: ['bollywood', 'travel', 'inspirational'],
    description: 'A.R. Rahman\'s composition sung by Mohit Chauhan, creating a sense of freedom and adventure. The song\'s flowing melody and naturalistic imagery evoke a journey of self-discovery.'
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
  {
    id: 'en-moderate-3',
    title: 'Electric Feel',
    artist: 'MGMT',
    album: 'Oracular Spectacular',
    releaseDate: '2008-01-01',
    language: 'english',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734c8f092adc59df0e6611ae18',
    duration: '3:49',
    spotifyUrl: 'https://open.spotify.com/track/3FtYbEfBqAlGO46NUDQSAt',
    similarSongs: ['en-moderate-1', 'en-moderate-4'],
    tags: ['indie', 'psychedelic', 'electronic'],
    description: 'A neo-psychedelic track with a distinctive bassline and groove. The song combines electronic elements with a retro feel, creating an infectious mid-tempo vibe.'
  },
  {
    id: 'en-moderate-4',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    releaseDate: '2011-10-18',
    language: 'english',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735d90a445c3a243764c84b289',
    duration: '4:01',
    spotifyUrl: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt',
    similarSongs: ['en-moderate-3', 'en-moderate-5'],
    tags: ['electronic', 'synthpop', 'dreamy'],
    description: 'An electronic anthem with a driving beat, distinctive synthesizer sounds, and an iconic saxophone solo. The song\'s nostalgic atmosphere evokes city lights and urban nightlife.'
  },
  {
    id: 'en-moderate-5',
    title: 'Ain\'t No Sunshine',
    artist: 'Bill Withers',
    album: 'Just As I Am',
    releaseDate: '1971-05-01',
    language: 'english',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e1e350d06ffebd2e19e084c8',
    duration: '2:04',
    spotifyUrl: 'https://open.spotify.com/track/1xKdiuYoOCM2oCMErUjvtq',
    similarSongs: ['en-moderate-2', 'en-relaxed-1'],
    tags: ['soul', 'classic', 'acoustic'],
    description: 'A soulful classic with a memorable acoustic guitar groove and heartfelt vocals. Bill Withers\' repeated "I know, I know" refrain and the string arrangement create a timeless, emotive piece.'
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
  {
    id: 'hi-moderate-3',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Javed Ali, Mohit Chauhan',
    album: 'Rockstar',
    releaseDate: '2011-09-30',
    language: 'hindi',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2737ff50b93aa1cb2efadb85d0b',
    duration: '7:52',
    spotifyUrl: 'https://open.spotify.com/track/6Ls7RrrXBekYCCllxPzCcI',
    similarSongs: ['hi-relaxed-5', 'hi-moderate-4'],
    tags: ['sufi', 'spiritual', 'qawwali'],
    description: 'A mesmerizing Sufi composition combining traditional qawwali elements with contemporary production. The spiritual lyrics and measured pace create a meditative, transcendent experience.'
  },
  {
    id: 'hi-moderate-4',
    title: 'Khaabon Ke Parinday',
    artist: 'Mohit Chauhan, Alyssa Mendonsa',
    album: 'Zindagi Na Milegi Dobara',
    releaseDate: '2011-06-24',
    language: 'hindi',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f54cd9fac9e4ecb9c4cd5935',
    duration: '4:54',
    spotifyUrl: 'https://open.spotify.com/track/6FsAGabZNY4f5Q8b1i5dDG',
    similarSongs: ['hi-moderate-3', 'hi-moderate-5'],
    tags: ['travel', 'inspirational', 'acoustic'],
    description: 'A poetic song about dreams and freedom with a balanced blend of acoustic guitar, percussion, and ambient sounds. The duet between Mohit Chauhan and Alyssa Mendonsa creates a sense of journey and discovery.'
  },
  {
    id: 'hi-moderate-5',
    title: 'Manja',
    artist: 'Amit Trivedi',
    album: 'Kai Po Che!',
    releaseDate: '2013-01-18',
    language: 'hindi',
    category: SongCategory.MODERATE,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a6e5acd6d544bb416bdb416a',
    duration: '3:58',
    spotifyUrl: 'https://open.spotify.com/track/41uYdnQGgDiXJY53qnh0r6',
    similarSongs: ['hi-moderate-4', 'hi-upbeat-1'],
    tags: ['friendship', 'uplifting', 'indie'],
    description: 'A balanced song about friendship and youth with a moderate tempo and dynamic arrangement. Amit Trivedi\'s composition blends rock elements with traditional Indian instrumentation.'
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
  {
    id: 'en-upbeat-3',
    title: 'Superstition',
    artist: 'Stevie Wonder',
    album: 'Talking Book',
    releaseDate: '1972-10-28',
    language: 'english',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273af66e072efe23a8a502131d0',
    duration: '4:26',
    spotifyUrl: 'https://open.spotify.com/track/1qiQduM84n03JuX2C3VFPQ',
    similarSongs: ['en-upbeat-1', 'en-upbeat-4'],
    tags: ['funk', 'soul', 'classic'],
    description: 'A funk masterpiece with an iconic clavinet riff, driving rhythm section, and Stevie Wonder\'s powerful vocals. The song\'s groove and energy make it an enduring dance floor favorite.'
  },
  {
    id: 'en-upbeat-4',
    title: 'Get Lucky',
    artist: 'Daft Punk, Pharrell Williams, Nile Rodgers',
    album: 'Random Access Memories',
    releaseDate: '2013-04-19',
    language: 'english',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268',
    duration: '6:07',
    spotifyUrl: 'https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq',
    similarSongs: ['en-upbeat-3', 'en-upbeat-5'],
    tags: ['disco', 'electronic', 'funk'],
    description: 'A modern disco revival featuring Nile Rodgers\' distinctive guitar work, Pharrell Williams\' smooth vocals, and Daft Punk\'s electronic production. The song celebrates music, dance, and good fortune.'
  },
  {
    id: 'en-upbeat-5',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    album: 'The Best of Earth, Wind & Fire, Vol. 1',
    releaseDate: '1978-11-01',
    language: 'english',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2733b11178cccd78ec77fc11dfe',
    duration: '3:35',
    spotifyUrl: 'https://open.spotify.com/track/7Cuk8jsPPoNYQWXK9XRFvG',
    similarSongs: ['en-upbeat-3', 'en-upbeat-4'],
    tags: ['funk', 'disco', 'celebration'],
    description: 'A joyful celebration with a vibrant horn section, uplifting vocals, and an infectious chorus. The song\'s bright energy and memorable melody make it perfect for celebrations and good times.'
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
  {
    id: 'hi-upbeat-3',
    title: 'Balam Pichkari',
    artist: 'Vishal Dadlani, Shalmali Kholgade',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-28',
    language: 'hindi',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e0b702162552f71ba6ce7111',
    duration: '4:10',
    spotifyUrl: 'https://open.spotify.com/track/1VhD0UtTytVMNYXWARtAuC',
    similarSongs: ['hi-upbeat-2', 'hi-upbeat-4'],
    tags: ['bollywood', 'holi', 'celebration'],
    description: 'A festive Holi song with a contagious energy and playful vocal exchanges between Vishal Dadlani and Shalmali Kholgade. The dhol beats and vibrant instrumentation capture the joyful spirit of the festival.'
  },
  {
    id: 'hi-upbeat-4',
    title: 'Kar Gayi Chull',
    artist: 'Badshah, Fazilpuria, Sukriti Kakar, Neha Kakkar',
    album: 'Kapoor & Sons',
    releaseDate: '2016-03-18',
    language: 'hindi',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273e101ba816e65d8cc2b5e8eb6',
    duration: '3:14',
    spotifyUrl: 'https://open.spotify.com/track/6Lm3H9mHAQeBrdHvfhR7Bb',
    similarSongs: ['hi-upbeat-3', 'hi-energetic-2'],
    tags: ['bollywood', 'party', 'dance'],
    description: 'A modern party anthem combining contemporary Bollywood sounds with rap verses and catchy vocal hooks. The song\'s production creates an upbeat, celebratory atmosphere ideal for parties.'
  },
  {
    id: 'hi-upbeat-5',
    title: 'Kala Chashma',
    artist: 'Amar Arshi, Badshah, Neha Kakkar',
    album: 'Baar Baar Dekho',
    releaseDate: '2016-07-27',
    language: 'hindi',
    category: SongCategory.UPBEAT,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8be9a444d228a50b4fa2ff7',
    duration: '3:56',
    spotifyUrl: 'https://open.spotify.com/track/24LW75z3uaWaKkp7X8fJ3S',
    similarSongs: ['hi-upbeat-4', 'hi-energetic-1'],
    tags: ['bollywood', 'dance', 'party'],
    description: 'A remake of a Punjabi classic with modern production and a high-energy dance beat. The song\'s catchy hook and vibrant arrangement make it a standout track for celebrations and dance floors.'
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
  {
    id: 'en-energetic-3',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    album: 'Eye of the Tiger',
    releaseDate: '1982-05-31',
    language: 'english',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b79d542383baee5640af5b7b',
    duration: '4:05',
    spotifyUrl: 'https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2',
    similarSongs: ['en-energetic-1', 'en-energetic-5'],
    tags: ['rock', 'motivational', 'workout'],
    description: 'The iconic Rocky III theme with its instantly recognizable guitar riff and driving rhythm. The song\'s motivational lyrics and powerful arrangement make it a perfect soundtrack for overcoming challenges.'
  },
  {
    id: 'en-energetic-4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    releaseDate: '2019-11-29',
    language: 'english',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    duration: '3:20',
    spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    similarSongs: ['en-energetic-5', 'en-upbeat-4'],
    tags: ['synthwave', 'pop', 'retro'],
    description: 'A pulsating synthwave track with a driving beat and nostalgic 80s-inspired production. The Weeknd\'s vocals and the propulsive arrangement create an energetic atmosphere perfect for running or working out.'
  },
  {
    id: 'en-energetic-5',
    title: 'Titanium',
    artist: 'David Guetta, Sia',
    album: 'Nothing but the Beat',
    releaseDate: '2011-12-09',
    language: 'english',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2733e2502e85da8ae970f987c5c',
    duration: '4:05',
    spotifyUrl: 'https://open.spotify.com/track/0NTMtAO2BV4tnGvw9EgBVb',
    similarSongs: ['en-energetic-4', 'en-energetic-3'],
    tags: ['edm', 'dance', 'empowerment'],
    description: 'An uplifting electronic dance anthem with Sia\'s powerful vocals and David Guetta\'s dynamic production. The song builds from a gentle verse to an explosive chorus celebrating resilience and strength.'
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
  },
  {
    id: 'hi-energetic-3',
    title: 'Ziddi Dil',
    artist: 'Vishal Dadlani, Shreya Ghoshal',
    album: 'Mary Kom',
    releaseDate: '2014-08-13',
    language: 'hindi',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27381e77ca69bb3ffbb632d8f29',
    duration: '4:18',
    spotifyUrl: 'https://open.spotify.com/track/6dLEEAHwzS0Usg3kVwWAMm',
    similarSongs: ['hi-energetic-2', 'hi-energetic-4'],
    tags: ['motivational', 'sports', 'anthem'],
    description: 'A powerful sports anthem with dynamic percussion, energetic vocals, and inspirational lyrics. The song\'s arrangement builds intensity throughout, making it perfect for workouts and motivation.'
  },
  {
    id: 'hi-energetic-4',
    title: 'Sadda Haq',
    artist: 'Mohit Chauhan',
    album: 'Rockstar',
    releaseDate: '2011-09-30',
    language: 'hindi',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2737ff50b93aa1cb2efadb85d0b',
    duration: '5:58',
    spotifyUrl: 'https://open.spotify.com/track/0RYTQOYqxqXNnmGVYXQVKJ',
    similarSongs: ['hi-energetic-3', 'hi-energetic-5'],
    tags: ['rock', 'protest', 'rebellion'],
    description: 'A rock anthem with hard-hitting guitar riffs and passionate vocals by Mohit Chauhan. The song\'s rebellious energy and defiant lyrics make it a powerful expression of standing up for one\'s rights.'
  },
  {
    id: 'hi-energetic-5',
    title: 'Chak De India',
    artist: 'Sukhwinder Singh',
    album: 'Chak De India',
    releaseDate: '2007-08-10',
    language: 'hindi',
    category: SongCategory.ENERGETIC,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f41efd5a4e43301c4300f920',
    duration: '4:41',
    spotifyUrl: 'https://open.spotify.com/track/1pKYYY7BM0jCauHW6w6SUl',
    similarSongs: ['hi-energetic-3', 'hi-energetic-1'],
    tags: ['sports', 'patriotic', 'inspirational'],
    description: 'The iconic title track from the sports drama film, featuring Sukhwinder Singh\'s powerful vocals and a rousing arrangement. The song has become an unofficial sports anthem in India with its motivational message.'
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
