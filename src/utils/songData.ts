
import { SongCategory, determineSongCategory, MoodParams } from './fuzzyLogic';

// Song data structure
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  language: 'English' | 'Hindi';
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
    language: 'English',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732d60677a02438991cc6b25ea',
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
    language: 'English',
    category: SongCategory.CALM,
    coverImage: 'https://i1.sndcdn.com/artworks-000262175996-6q9ovb-t500x500.jpg',
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
    language: 'English',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a1a2f9ef42c94cdca25813e4',
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
    language: 'English',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273d449ccd8b75847d8afe4fe9e',
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
    language: 'English',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f2c7155f97edfbc3c1d1af6d',
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
    language: 'Hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ab8eb21eeda8094f7741534f',
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
    language: 'Hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a58a09b161c806587fe97b6e',
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
    language: 'Hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.ytimg.com/vi/wx89ZdkwtS8/maxresdefault.jpg',
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
    language: 'Hindi',
    category: SongCategory.CALM,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273675b3f7dea80153c73581e5e',
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
    language: 'Hindi',
    category: SongCategory.CALM,
    coverImage: 'https://philicpiano.com/wp-content/uploads/2022/05/Bol-Na-Halke-Halke.jpg',
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
    language: 'English',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734fb043195e8d07e72edc7226',
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
    language: 'English',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273567b0a6defc057bcbfaedadb',
    duration: '5:37',
    spotifyUrl: 'https://open.spotify.com/track/3TZrEkZ0kcs36MJIaTnHtH',
    similarSongs: ['en-relaxed-1', 'en-Moderate-1'],
    tags: ['indie folk', 'atmospheric', 'winter'],
    description: 'A hauntingly beautiful track with layered instrumentation and Justin Vernon\'s distinctive falsetto vocals, creating a reflective and immersive listening experience.'
  },
  {
    id: 'en-relaxed-3',
    title: 'Harvest Moon',
    artist: 'Neil Young',
    album: 'Harvest Moon',
    releaseDate: '1992-10-27',
    language: 'English',
    category: SongCategory.RELAXED,
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Harvest_Moon_single.jpg',
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
    language: 'English',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2739626ee117a93c158d17aee17',
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
    language: 'English',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27317875a0610c23d8946454583',
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
    language: 'Hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273da50894e074ecd5ce61de0a1',
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
    language: 'Hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://c.saavncdn.com/440/Yeh-Jawaani-Hai-Deewani-2013-500x500.jpg',
    duration: '3:43',
    spotifyUrl: 'https://open.spotify.com/track/2KGxABXWDYuykkSQdhtj8G',
    similarSongs: ['hi-relaxed-1', 'hi-Moderate-1'],
    tags: ['bollywood', 'melodic', 'philosophical'],
    description: 'A melodious track with philosophical undertones, featuring the complementary voices of Arijit Singh and Harshdeep Kaur. The acoustic arrangement gives it a relaxed, introspective feel.'
  },
  {
    id: 'hi-relaxed-3',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    album: 'Jab We Met',
    releaseDate: '2007-10-26',
    language: 'Hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://images.genius.com/62667f1b93a95247fb37501a4166f39b.1000x1000x1.jpg',
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
    language: 'Hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2731c903077054df0697fa1e9fd',
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
    language: 'Hindi',
    category: SongCategory.RELAXED,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27354e544672baa16145d67612b',
    duration: '4:25',
    spotifyUrl: 'https://open.spotify.com/track/6VMIB1Ty8xG1jRwZmHyqRs',
    similarSongs: ['hi-relaxed-3', 'hi-Moderate-1'],
    tags: ['bollywood', 'travel', 'inspirational'],
    description: 'A.R. Rahman\'s composition sung by Mohit Chauhan, creating a sense of freedom and adventure. The song\'s flowing melody and naturalistic imagery evoke a journey of self-discovery.'
  },

  // Moderate - English Songs
  {
    id: 'en-Moderate-1',
    title: 'Redbone',
    artist: 'Childish Gambino',
    album: 'Awaken, My Love!',
    releaseDate: '2016-12-02',
    language: 'English',
    category: SongCategory.Moderate,
    coverImage: 'https://s3.amazonaws.com/halleonard-coverimages/wl/00265304-wl.jpg',
    duration: '5:26',
    spotifyUrl: 'https://open.spotify.com/track/3kxfsdsCpFgN412fpnW85Y',
    similarSongs: ['en-Moderate-2', 'en-Upbeat-1'],
    tags: ['funk', 'psychedelic', 'soul'],
    description: 'A psychedelic soul and funk track with a distinctive groove, falsetto vocals, and layered instrumentation that creates a hypnotic atmosphere with subtle intensity.'
  },
  {
    id: 'en-Moderate-2',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    album: 'Rumours',
    releaseDate: '1977-02-04',
    language: 'English',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735e66bc0df2bd18e746dbb823',
    duration: '4:14',
    spotifyUrl: 'https://open.spotify.com/track/0ofHAoxe9vBkTCp2UQIavz',
    similarSongs: ['en-Moderate-1', 'en-relaxed-1'],
    tags: ['classic rock', 'pop rock', 'mellow'],
    description: 'A timeless hit with a distinctive drum pattern and rhythm section that creates a Moderate groove, while Stevie Nicks\' vocals add a dreamy quality to the track.'
  },
  {
    id: 'en-Moderate-3',
    title: 'Electric Feel',
    artist: 'MGMT',
    album: 'Oracular Spectacular',
    releaseDate: '2008-01-01',
    language: 'English',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb',
    duration: '3:49',
    spotifyUrl: 'https://open.spotify.com/track/3FtYbEfBqAlGO46NUDQSAt',
    similarSongs: ['en-Moderate-1', 'en-Moderate-4'],
    tags: ['indie', 'psychedelic', 'electronic'],
    description: 'A neo-psychedelic track with a distinctive bassline and groove. The song combines electronic elements with a retro feel, creating an infectious mid-tempo vibe.'
  },
  {
    id: 'en-Moderate-4',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    releaseDate: '2011-10-18',
    language: 'English',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273fff2cb485c36a6d8f639bdba',
    duration: '4:01',
    spotifyUrl: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt',
    similarSongs: ['en-Moderate-3', 'en-Moderate-5'],
    tags: ['electronic', 'synthpop', 'dreamy'],
    description: 'An electronic anthem with a driving beat, distinctive synthesizer sounds, and an iconic saxophone solo. The song\'s nostalgic atmosphere evokes city lights and urban nightlife.'
  },
  {
    id: 'en-Moderate-5',
    title: 'Ain\'t No Sunshine',
    artist: 'Bill Withers',
    album: 'Just As I Am',
    releaseDate: '1971-05-01',
    language: 'English',
    category: SongCategory.Moderate,
    coverImage: 'https://f4.bcbits.com/img/a2635293411_16.jpg',
    duration: '2:04',
    spotifyUrl: 'https://open.spotify.com/track/1xKdiuYoOCM2oCMErUjvtq',
    similarSongs: ['en-Moderate-2', 'en-relaxed-1'],
    tags: ['soul', 'classic', 'acoustic'],
    description: 'A soulful classic with a memorable acoustic guitar groove and heartfelt vocals. Bill Withers\' repeated "I know, I know" refrain and the string arrangement create a timeless, emotive piece.'
  },

  // Moderate - Hindi Songs
  {
    id: 'hi-Moderate-1',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    language: 'Hindi',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ff1cda069aac9352c258f8d1',
    duration: '4:49',
    spotifyUrl: 'https://open.spotify.com/track/2XzINNCfwR7dLqTvq3r6TH',
    similarSongs: ['hi-Moderate-2', 'hi-relaxed-1'],
    tags: ['bollywood', 'romantic', 'classical elements'],
    description: 'Pritam\'s composition sung by Arijit Singh blends traditional Indian instruments with contemporary production. The song builds from a subtle beginning to an emotionally powerful chorus.'
  },
  {
    id: 'hi-Moderate-2',
    title: 'Zinda',
    artist: 'Siddharth Mahadevan',
    album: 'Bhaag Milkha Bhaag',
    releaseDate: '2013-07-12',
    language: 'Hindi',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273846863bbeafbd0c6411b38ca',
    duration: '3:34',
    spotifyUrl: 'https://open.spotify.com/track/5Qla2Sy0MzojX8JpC4ALCE',
    similarSongs: ['hi-Moderate-1', 'hi-Upbeat-1'],
    tags: ['motivational', 'soundtrack', 'rock elements'],
    description: 'A motivational track composed by Shankar-Ehsaan-Loy with a steady buildup and inspirational lyrics. The rock influences and powerful vocals create an energizing yet controlled atmosphere.'
  },
  {
    id: 'hi-Moderate-3',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Javed Ali, Mohit Chauhan',
    album: 'Rockstar',
    releaseDate: '2011-09-30',
    language: 'Hindi',
    category: SongCategory.Moderate,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27354e544672baa16145d67612b',
    duration: '7:52',
    spotifyUrl: 'https://open.spotify.com/track/6Ls7RrrXBekYCCllxPzCcI',
    similarSongs: ['hi-relaxed-5', 'hi-Moderate-4'],
    tags: ['sufi', 'spiritual', 'qawwali'],
    description: 'A mesmerizing Sufi composition combining traditional qawwali elements with contemporary production. The spiritual lyrics and measured pace create a meditative, transcendent experience.'
  },
  {
    id: 'hi-Moderate-4',
    title: 'Khaabon Ke Parinday',
    artist: 'Mohit Chauhan, Alyssa Mendonsa',
    album: 'Zindagi Na Milegi Dobara',
    releaseDate: '2011-06-24',
    language: 'Hindi',
    category: SongCategory.Moderate,
    coverImage: 'https://c.saavncdn.com/787/Zindagi-Na-Milegi-Dobara-2011-500x500.jpg',
    duration: '4:54',
    spotifyUrl: 'https://open.spotify.com/track/6FsAGabZNY4f5Q8b1i5dDG',
    similarSongs: ['hi-Moderate-3', 'hi-Moderate-5'],
    tags: ['travel', 'inspirational', 'acoustic'],
    description: 'A poetic song about dreams and freedom with a balanced blend of acoustic guitar, percussion, and ambient sounds. The duet between Mohit Chauhan and Alyssa Mendonsa creates a sense of journey and discovery.'
  },
  {
    id: 'hi-Moderate-5',
    title: 'Manja',
    artist: 'Amit Trivedi',
    album: 'Kai Po Che!',
    releaseDate: '2013-01-18',
    language: 'Hindi',
    category: SongCategory.Moderate,
    coverImage: 'https://c.saavncdn.com/671/Kai-Po-Che-Hindi-2013-20200620081833-500x500.jpg',
    duration: '3:58',
    spotifyUrl: 'https://open.spotify.com/track/41uYdnQGgDiXJY53qnh0r6',
    similarSongs: ['hi-Moderate-4', 'hi-Upbeat-1'],
    tags: ['friendship', 'uplifting', 'indie'],
    description: 'A balanced song about friendship and youth with a Moderate tempo and dynamic arrangement. Amit Trivedi\'s composition blends rock elements with traditional Indian instrumentation.'
  },

  // Upbeat - English Songs
  {
    id: 'en-Upbeat-1',
    title: 'Uptown Funk',
    artist: 'Mark Ronson, Bruno Mars',
    album: 'Uptown Special',
    releaseDate: '2015-01-13',
    language: 'English',
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273f39cf5ac73db13318eebd38e',
    duration: '4:30',
    spotifyUrl: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
    similarSongs: ['en-Upbeat-2', 'en-Energetic-1'],
    tags: ['funk', 'pop', 'dance'],
    description: 'A catchy, funk-inspired hit with a prominent horn section, groovy bass line, and Bruno Mars\' charismatic vocals, creating an instantly recognizable dance track.'
  },
  {
    id: 'en-Upbeat-2',
    title: 'Feel Good Inc.',
    artist: 'Gorillaz',
    album: 'Demon Days',
    releaseDate: '2005-05-09',
    language: 'English',
    category: SongCategory.Upbeat,
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Feel_Good_Inc._Artwork.jpg',
    duration: '3:41',
    spotifyUrl: 'https://open.spotify.com/track/0d28khcov6AiegSCpG5TuT',
    similarSongs: ['en-Upbeat-1', 'en-Moderate-1'],
    tags: ['alternative', 'hip hop', 'electronic'],
    description: 'A genre-blending track that combines hip-hop beats, electronic elements, and alternative rock sensibilities, creating an infectious groove with distinct sections.'
  },
  {
    id: 'en-Upbeat-3',
    title: 'Superstition',
    artist: 'Stevie Wonder',
    album: 'Talking Book',
    releaseDate: '1972-10-28',
    language: 'English',
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a14b08b9a6616e121df5e8b0',
    duration: '4:26',
    spotifyUrl: 'https://open.spotify.com/track/1qiQduM84n03JuX2C3VFPQ',
    similarSongs: ['en-Upbeat-1', 'en-Upbeat-4'],
    tags: ['funk', 'soul', 'classic'],
    description: 'A funk masterpiece with an iconic clavinet riff, driving rhythm section, and Stevie Wonder\'s powerful vocals. The song\'s groove and energy make it an enduring dance floor favorite.'
  },
  {
    id: 'en-Upbeat-4',
    title: 'Get Lucky',
    artist: 'Daft Punk, Pharrell Williams, Nile Rodgers',
    album: 'Random Access Memories',
    releaseDate: '2013-04-19',
    language: 'English',
    category: SongCategory.Upbeat,
    coverImage: 'https://i.discogs.com/aaf_1a83-JxTZ3vnnYJZuZWAEFWyymiIJp4n8uDUpPo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ2NzU1/MzYtMTM3MTg5MTEx/My0zMjk1LmpwZWc.jpeg',
    duration: '6:07',
    spotifyUrl: 'https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq',
    similarSongs: ['en-Upbeat-3', 'en-Upbeat-5'],
    tags: ['disco', 'electronic', 'funk'],
    description: 'A modern disco revival featuring Nile Rodgers\' distinctive guitar work, Pharrell Williams\' smooth vocals, and Daft Punk\'s electronic production. The song celebrates music, dance, and good fortune.'
  },
  {
    id: 'en-Upbeat-5',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    album: 'The Best of Earth, Wind & Fire, Vol. 1',
    releaseDate: '1978-11-01',
    language: 'English',
    category: SongCategory.Upbeat,
    coverImage: 'https://cdns-images.dzcdn.net/images/cover/18f41ecd3781fb96bffa2b0b49955db5/1900x1900-000000-80-0-0.jpg',
    duration: '3:35',
    spotifyUrl: 'https://open.spotify.com/track/7Cuk8jsPPoNYQWXK9XRFvG',
    similarSongs: ['en-Upbeat-3', 'en-Upbeat-4'],
    tags: ['funk', 'disco', 'celebration'],
    description: 'A joyful celebration with a vibrant horn section, uplifting vocals, and an infectious chorus. The song\'s bright energy and memorable melody make it perfect for celebrations and good times.'
  },

  // Upbeat - Hindi Songs
  {
    id: 'hi-Upbeat-1',
    title: 'London Thumakda',
    artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar',
    album: 'Queen',
    releaseDate: '2014-02-07',
    language: 'Hindi',
    category: SongCategory.Upbeat,
    coverImage: 'https://c.saavncdn.com/125/Queen-2014-500x500.jpg',
    duration: '3:23',
    spotifyUrl: 'https://open.spotify.com/track/5uieCZSJq1XQGV33VGisQd',
    similarSongs: ['hi-Upbeat-2', 'hi-Energetic-1'],
    tags: ['bollywood', 'wedding', 'dance'],
    description: 'A vibrant wedding song with a catchy dhol beat and Energetic vocals. Its cheerful rhythm and playful lyrics make it perfect for celebrations and dance floors.'
  },
  {
    id: 'hi-Upbeat-2',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal, Shefali Alvares',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-28',
    language: 'Hindi',
    category: SongCategory.Upbeat,
    coverImage: 'https://c.saavncdn.com/440/Yeh-Jawaani-Hai-Deewani-2013-500x500.jpg',
    duration: '3:45',
    spotifyUrl: 'https://open.spotify.com/track/6vqIFc9viICqz4Vf2OuknJ',
    similarSongs: ['hi-Upbeat-1', 'hi-Energetic-2'],
    tags: ['bollywood', 'dance', 'romance'],
    description: 'A playful and Energetic song with catchy beats and a modern sound. Benny Dayal\'s spirited vocals and the dynamic orchestration create a perfect dance track.'
  },
  {
    id: 'hi-Upbeat-3',
    title: 'Balam Pichkari',
    artist: 'Vishal Dadlani, Shalmali Kholgade',
    album: 'Yeh Jawaani Hai Deewani',
    releaseDate: '2013-05-28',
    language: 'Hindi',
    category: SongCategory.Upbeat,
    coverImage: 'https://c.saavncdn.com/440/Yeh-Jawaani-Hai-Deewani-2013-500x500.jpg',
    duration: '4:10',
    spotifyUrl: 'https://open.spotify.com/track/1VhD0UtTytVMNYXWARtAuC',
    similarSongs: ['hi-Upbeat-2', 'hi-Upbeat-4'],
    tags: ['bollywood', 'holi', 'celebration'],
    description: 'A festive Holi song with a contagious energy and playful vocal exchanges between Vishal Dadlani and Shalmali Kholgade. The dhol beats and vibrant instrumentation capture the joyful spirit of the festival.'
  },
  {
    id: 'hi-Upbeat-4',
    title: 'Kar Gayi Chull',
    artist: 'Badshah, Fazilpuria, Sukriti Kakar, Neha Kakkar',
    album: 'Kapoor & Sons',
    releaseDate: '2016-03-18',
    language: 'Hindi',
    category: SongCategory.Upbeat,
    coverImage: 'https://c.saavncdn.com/352/Kar-Gayi-Chull-From-Kapoor-Sons-Since-1921--Hindi-2016-20180504165740-500x500.jpg',
    duration: '3:14',
    spotifyUrl: 'https://open.spotify.com/track/6Lm3H9mHAQeBrdHvfhR7Bb',
    similarSongs: ['hi-Upbeat-3', 'hi-Energetic-2'],
    tags: ['bollywood', 'party', 'dance'],
    description: 'A modern party anthem combining contemporary Bollywood sounds with rap verses and catchy vocal hooks. The song\'s production creates an Upbeat, celebratory atmosphere ideal for parties.'
  },
  {
    id: 'hi-Upbeat-5',
    title: 'Kala Chashma',
    artist: 'Amar Arshi, Badshah, Neha Kakkar',
    album: 'Baar Baar Dekho',
    releaseDate: '2016-07-27',
    language: 'Hindi',
    category: SongCategory.Upbeat,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2737938ce04e41528ae0b923f17',
    duration: '3:56',
    spotifyUrl: 'https://open.spotify.com/track/24LW75z3uaWaKkp7X8fJ3S',
    similarSongs: ['hi-Upbeat-4', 'hi-Energetic-1'],
    tags: ['bollywood', 'dance', 'party'],
    description: 'A remake of a Punjabi classic with modern production and a high-energy dance beat. The song\'s catchy hook and vibrant arrangement make it a standout track for celebrations and dance floors.'
  },

  // Energetic - English Songs
  {
    id: 'en-Energetic-1',
    title: 'Don\'t Stop Me Now',
    artist: 'Queen',
    album: 'Jazz',
    releaseDate: '1979-01-26',
    language: 'English',
    category: SongCategory.Energetic,
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/9/97/Queen-dont-stop-me-now-1979-6-s.jpg',
    duration: '3:29',
    spotifyUrl: 'https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i',
    similarSongs: ['en-Energetic-2', 'en-Upbeat-1'],
    tags: ['rock', 'classic', 'anthem'],
    description: 'A high-energy rock anthem with Freddie Mercury\'s powerful vocals, driving piano, and an uplifting message. The relentless pace and dynamic instrumentation make it a timeless motivational track.'
  },
  {
    id: 'en-Energetic-2',
    title: 'Stronger',
    artist: 'Kanye West',
    album: 'Graduation',
    releaseDate: '2007-09-11',
    language: 'English',
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27326f7f19c7f0381e56156c94a',
    duration: '5:11',
    spotifyUrl: 'https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3',
    similarSongs: ['en-Energetic-1', 'en-Upbeat-2'],
    tags: ['hip hop', 'electronic', 'workout'],
    description: 'A powerhouse track sampling Daft Punk with driving electronic beats and confident lyrics. The combination of hip-hop and electronic elements creates a high-energy atmosphere perfect for workouts.'
  },
  {
    id: 'en-Energetic-3',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    album: 'Eye of the Tiger',
    releaseDate: '1982-05-31',
    language: 'English',
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734e2755e7a96ec5e062c76aac',
    duration: '4:05',
    spotifyUrl: 'https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2',
    similarSongs: ['en-Energetic-1', 'en-Energetic-5'],
    tags: ['rock', 'motivational', 'workout'],
    description: 'The iconic Rocky III theme with its instantly recognizable guitar riff and driving rhythm. The song\'s motivational lyrics and powerful arrangement make it a perfect soundtrack for overcoming challenges.'
  },
  {
    id: 'en-Energetic-4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    releaseDate: '2019-11-29',
    language: 'English',
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36',
    duration: '3:20',
    spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    similarSongs: ['en-Energetic-5', 'en-Upbeat-4'],
    tags: ['synthwave', 'pop', 'retro'],
    description: 'A pulsating synthwave track with a driving beat and nostalgic 80s-inspired production. The Weeknd\'s vocals and the propulsive arrangement create an Energetic atmosphere perfect for running or working out.'
  },
  {
    id: 'en-Energetic-5',
    title: 'Titanium',
    artist: 'David Guetta, Sia',
    album: 'Nothing but the Beat',
    releaseDate: '2011-12-09',
    language: 'English',
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735c8cfe4b2c4aa89c9c92108e',
    duration: '4:05',
    spotifyUrl: 'https://open.spotify.com/track/0NTMtAO2BV4tnGvw9EgBVb',
    similarSongs: ['en-Energetic-4', 'en-Energetic-3'],
    tags: ['edm', 'dance', 'empowerment'],
    description: 'An uplifting electronic dance anthem with Sia\'s powerful vocals and David Guetta\'s dynamic production. The song builds from a gentle verse to an explosive chorus celebrating resilience and strength.'
  },

  // Energetic - Hindi Songs
  {
    id: 'hi-Energetic-1',
    title: 'Dhoom Machale',
    artist: 'Sunidhi Chauhan',
    album: 'Dhoom',
    releaseDate: '2004-08-27',
    language: 'Hindi',
    category: SongCategory.Energetic,
    coverImage: 'https://c.saavncdn.com/074/Dhoom-Hindi-2004-500x500.jpg',
    duration: '3:48',
    spotifyUrl: 'https://open.spotify.com/track/2VwO9qzA2xr3gQiZA50YGW',
    similarSongs: ['hi-Energetic-2', 'hi-Upbeat-1'],
    tags: ['bollywood', 'dance', 'action'],
    description: 'The high-octane title track from the action film Dhoom. Sunidhi Chauhan\'s powerful vocals combined with the pulsating beats and dynamic production create an adrenaline-pumping experience.'
  },
  {
    id: 'hi-Energetic-2',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    album: 'Bajirao Mastani',
    releaseDate: '2015-12-18',
    language: 'Hindi',
    category: SongCategory.Energetic,
    coverImage: 'https://m.media-amazon.com/images/I/61mUAWGQIAL._UXNaN_FMjpg_QL85_.jpg',
    duration: '3:32',
    spotifyUrl: 'https://open.spotify.com/track/4BFrPQcUkWgQBgX3DuFg33',
    similarSongs: ['hi-Energetic-1', 'hi-Upbeat-2'],
    tags: ['bollywood', 'celebration', 'traditional'],
    description: 'A powerful victory celebration song with intense dhol beats, traditional instruments, and Vishal Dadlani\'s Energetic vocals. The song combines classical elements with modern production for maximum impact.'
  },
  {
    id: 'hi-Energetic-3',
    title: 'Ziddi Dil',
    artist: 'Vishal Dadlani, Shreya Ghoshal',
    album: 'Mary Kom',
    releaseDate: '2014-08-13',
    language: 'Hindi',
    category: SongCategory.Energetic,
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/57/Mary_Kom_soundtrack_album_cover.jpg',
    duration: '4:18',
    spotifyUrl: 'https://open.spotify.com/track/6dLEEAHwzS0Usg3kVwWAMm',
    similarSongs: ['hi-Energetic-2', 'hi-Energetic-4'],
    tags: ['motivational', 'sports', 'anthem'],
    description: 'A powerful sports anthem with dynamic percussion, Energetic vocals, and inspirational lyrics. The song\'s arrangement builds intensity throughout, making it perfect for workouts and motivation.'
  },
  {
    id: 'hi-Energetic-4',
    title: 'Sadda Haq',
    artist: 'Mohit Chauhan',
    album: 'Rockstar',
    releaseDate: '2011-09-30',
    language: 'Hindi',
    category: SongCategory.Energetic,
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27354e544672baa16145d67612b',
    duration: '5:58',
    spotifyUrl: 'https://open.spotify.com/track/0RYTQOYqxqXNnmGVYXQVKJ',
    similarSongs: ['hi-Energetic-3', 'hi-Energetic-5'],
    tags: ['rock', 'protest', 'rebellion'],
    description: 'A rock anthem with hard-hitting guitar riffs and passionate vocals by Mohit Chauhan. The song\'s rebellious energy and defiant lyrics make it a powerful expression of standing up for one\'s rights.'
  },
  {
    id: 'hi-Energetic-5',
    title: 'Chak De India',
    artist: 'Sukhwinder Singh',
    album: 'Chak De India',
    releaseDate: '2007-08-10',
    language: 'Hindi',
    category: SongCategory.Energetic,
    coverImage: 'https://resizing.flixster.com/bGe-UIhjnjCmygicDVVfK1NgiAA=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p168383_v_h9_ad.jpg',
    duration: '4:41',
    spotifyUrl: 'https://open.spotify.com/track/1pKYYY7BM0jCauHW6w6SUl',
    similarSongs: ['hi-Energetic-3', 'hi-Energetic-1'],
    tags: ['sports', 'patriotic', 'inspirational'],
    description: 'The iconic title track from the sports drama film, featuring Sukhwinder Singh\'s powerful vocals and a rousing arrangement. The song has become an unofficial sports anthem in India with its motivational message.'
  }
];

// Helper function to get songs by category
export const getSongsByCategory = (category: SongCategory, language?: 'English' | 'Hindi'): Song[] => {
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
  language?: 'English' | 'Hindi'
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
  let languages: ('English' | 'Hindi')[] = [];
  
  if (includeEnglish) languages.push('English');
  if (includeHindi) languages.push('Hindi');
  
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
