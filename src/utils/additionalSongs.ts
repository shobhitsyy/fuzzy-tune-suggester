import { Song, SongCategoryType } from './fuzzyLogic';

export const additionalCalmSongs: Song[] = [
  {
    id: 'calm-001',
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Weightless',
    releaseDate: '2011-01-01',
    category: 'calm',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '8:08',
    spotifyUrl: 'https://open.spotify.com/track/3IAmlsIjjI8nObqZqx5JzK',
    tags: ['ambient', 'relaxing', 'meditation'],
    description: 'A scientifically crafted ambient track designed to reduce anxiety'
  },
  {
    id: 'calm-002',
    title: 'River',
    artist: 'Joni Mitchell',
    album: 'Blue',
    releaseDate: '1971-06-22',
    category: 'calm',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '4:00',
    spotifyUrl: 'https://open.spotify.com/track/4Bz97jGM9bSubTEDJ6F6g4',
    tags: ['folk', 'peaceful', 'classic'],
    description: 'A beautiful folk ballad about longing and peace'
  },
  {
    id: 'calm-003',
    title: 'Mad World',
    artist: 'Gary Jules',
    album: 'Trading Snakeoil for Wolftickets',
    releaseDate: '2001-05-01',
    category: 'calm',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=300&h=300',
    duration: '3:07',
    spotifyUrl: 'https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP',
    tags: ['melancholic', 'atmospheric', 'cover'],
    description: 'A hauntingly beautiful cover of the Tears for Fears classic'
  },
  {
    id: 'calm-004',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    album: 'Strange Trails',
    releaseDate: '2015-04-07',
    category: 'calm',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300',
    duration: '3:28',
    spotifyUrl: 'https://open.spotify.com/track/7x9pI8J5qPwJKzZoaydGbR',
    tags: ['indie folk', 'romantic', 'nostalgic'],
    description: 'A melancholic indie folk song about lost love and regret'
  },
  {
    id: 'calm-005',
    title: 'Holocene',
    artist: 'Bon Iver',
    album: 'Bon Iver, Bon Iver',
    releaseDate: '2011-06-17',
    category: 'calm',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '5:36',
    spotifyUrl: 'https://open.spotify.com/track/7GkZs2cyuQhgxRBAP2GV5P',
    tags: ['indie', 'ethereal', 'contemplative'],
    description: 'An ethereal indie track with beautiful harmonies and introspective lyrics'
  }
];

export const additionalModerateSongs: Song[] = [
  {
    id: 'moderate-001',
    title: 'Stay',
    artist: 'Rihanna',
    album: 'Unapologetic',
    releaseDate: '2012-11-19',
    category: 'moderate',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '4:00',
    spotifyUrl: 'https://open.spotify.com/track/2Cd9iWfcOpGDHLz6tVA3G4',
    tags: ['pop', 'ballad', 'emotional'],
    description: 'A powerful pop ballad about vulnerability and love'
  },
  {
    id: 'moderate-002',
    title: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    releaseDate: '2011-01-24',
    category: 'moderate',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '4:45',
    spotifyUrl: 'https://open.spotify.com/track/1wjzFQodRWrPcQ0AnYnvQ9',
    tags: ['soul', 'heartbreak', 'piano'],
    description: 'A soulful ballad about accepting the end of a relationship'
  },
  {
    id: 'moderate-003',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    releaseDate: '2014-06-20',
    category: 'upbeat',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=300&h=300',
    duration: '4:41',
    spotifyUrl: 'https://open.spotify.com/track/lp7hVTBH1vBVPVvFHaXuHs',
    tags: ['acoustic', 'romantic', 'guitar'],
    description: 'A romantic acoustic love song with heartfelt lyrics'
  },
  {
    id: 'moderate-004',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    releaseDate: '2017-03-03',
    category: 'upbeat',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300',
    duration: '4:23',
    spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
    tags: ['love song', 'wedding', 'acoustic'],
    description: 'A perfect love song for weddings and romantic moments'
  },
  {
    id: 'moderate-005',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    releaseDate: '2013-05-14',
    category: 'energetic',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '4:29',
    spotifyUrl: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a',
    tags: ['soul', 'piano', 'wedding'],
    description: 'A soulful love song dedicated to unconditional love'
  },
  {
    id: 'moderate-006',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    album: 'A Thousand Years',
    releaseDate: '2011-10-18',
    category: 'energetic',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '4:45',
    spotifyUrl: 'https://open.spotify.com/track/6ThiGTc8K7G1yQm5eFV0Wh',
    tags: ['romantic', 'orchestral', 'movie soundtrack'],
    description: 'A romantic ballad from the Twilight soundtrack'
  }
];

export const additionalHindiCalmSongs: Song[] = [
  {
    id: 'hindi-calm-001',
    title: 'Tujhe Kitna Chahne Lage',
    artist: 'Arijit Singh',
    album: 'Kabir Singh',
    releaseDate: '2019-06-21',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '4:20',
    spotifyUrl: 'https://open.spotify.com/track/1RDHFYwJ8U8gG6k9o6vEpV',
    tags: ['romantic', 'bollywood', 'soulful'],
    description: 'A soulful romantic song expressing deep love'
  },
  {
    id: 'hindi-calm-002',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '4:49',
    spotifyUrl: 'https://open.spotify.com/track/1xK1Gg9SxG8slzjstU1Mg1',
    tags: ['heartbreak', 'emotional', 'bollywood'],
    description: 'A heartbreaking song about unrequited love'
  },
  {
    id: 'hindi-calm-003',
    title: 'Raabta',
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    releaseDate: '2012-03-23',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=300&h=300',
    duration: '4:05',
    spotifyUrl: 'https://open.spotify.com/track/3oSeVRwadRKRbykABwJG52',
    tags: ['romantic', 'soulful', 'bollywood'],
    description: 'A beautiful song about the connection between two souls'
  },
  {
    id: 'hindi-calm-004',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    releaseDate: '2016-10-28',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300',
    duration: '4:29',
    spotifyUrl: 'https://open.spotify.com/track/4xkOaSrkexMciUUogZKVTS',
    tags: ['love', 'pain', 'bollywood'],
    description: 'A song about the difficulty of love and heartbreak'
  }
];

export const additionalHindiModerateSongs: Song[] = [
  {
    id: 'hindi-moderate-001',
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    releaseDate: '2022-08-17',
    category: 'moderate',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '4:28',
    spotifyUrl: 'https://open.spotify.com/track/1BHGNd4yVpUV5QnLDqGnNR',
    tags: ['romantic', 'melodic', 'bollywood'],
    description: 'A melodic romantic song with beautiful lyrics'
  },
  {
    id: 'hindi-moderate-002',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam',
    album: 'Tiger Zinda Hai',
    releaseDate: '2017-12-22',
    category: 'moderate',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '3:55',
    spotifyUrl: 'https://open.spotify.com/track/2Xr1dTzJee307rmB8gCJKs',
    tags: ['love', 'cheerful', 'bollywood'],
    description: 'A cheerful love song with upbeat melodies'
  },
  {
    id: 'hindi-moderate-003',
    title: 'Tera Ban Jaunga',
    artist: 'Akhil Sachdeva & Tulsi Kumar',
    album: 'Kabir Singh',
    releaseDate: '2019-06-21',
    category: 'upbeat',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=300&h=300',
    duration: '3:55',
    spotifyUrl: 'https://open.spotify.com/track/2Xr1dTzJee307rmB8gCJKs',
    tags: ['romantic', 'uplifting', 'bollywood'],
    description: 'An uplifting romantic song about devotion'
  },
  {
    id: 'hindi-moderate-004',
    title: 'Bekhayali',
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    releaseDate: '2019-06-21',
    category: 'upbeat',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300',
    duration: '6:10',
    spotifyUrl: 'https://open.spotify.com/track/4xkOaSrkexMciUUogZKVTS',
    tags: ['heartbreak', 'emotional', 'bollywood'],
    description: 'An emotional song about being lost in thoughts of love'
  },
  {
    id: 'hindi-moderate-005',
    title: 'Kalank',
    artist: 'Arijit Singh',
    album: 'Kalank',
    releaseDate: '2019-04-17',
    category: 'energetic',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '4:46',
    spotifyUrl: 'https://open.spotify.com/track/1BHGNd4yVpUV5QnLDqGnNR',
    tags: ['emotional', 'dramatic', 'bollywood'],
    description: 'A dramatic and emotional song from the movie Kalank'
  },
  {
    id: 'hindi-moderate-006',
    title: 'Shayad',
    artist: 'Arijit Singh',
    album: 'Love Aaj Kal',
    releaseDate: '2020-02-14',
    category: 'energetic',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '3:06',
    spotifyUrl: 'https://open.spotify.com/track/2Xr1dTzJee307rmB8gCJKs',
    tags: ['love', 'uncertainty', 'bollywood'],
    description: 'A song about the uncertainty and hope in love'
  }
];

export const additionalHindiUpbeatSongs: Song[] = [
  {
    id: 'hindi-upbeat-001',
    title: 'Gal Karke',
    artist: 'Asees Kaur & Sachet Tandon',
    album: 'Gal Karke',
    releaseDate: '2019-03-15',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '3:22',
    spotifyUrl: 'https://open.spotify.com/track/1BHGNd4yVpUV5QnLDqGnNR',
    tags: ['upbeat', 'dance', 'punjabi'],
    description: 'An upbeat Punjabi dance track'
  },
  {
    id: 'hindi-upbeat-002',
    title: 'Kala Chashma',
    artist: 'Amar Arshi, Neha Kakkar & Indeep Bakshi',
    album: 'Baar Baar Dekho',
    releaseDate: '2016-08-26',
    category: 'calm',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&h=300',
    duration: '3:28',
    spotifyUrl: 'https://open.spotify.com/track/2Xr1dTzJee307rmB8gCJKs',
    tags: ['party', 'dance', 'bollywood'],
    description: 'A party anthem with catchy beats'
  },
  {
    id: 'hindi-upbeat-003',
    title: 'Naach Meri Rani',
    artist: 'Guru Randhawa & Nora Fatehi',
    album: 'Naach Meri Rani',
    releaseDate: '2020-10-15',
    category: 'moderate',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=300&h=300',
    duration: '2:54',
    spotifyUrl: 'https://open.spotify.com/track/4xkOaSrkexMciUUogZKVTS',
    tags: ['dance', 'party', 'punjabi'],
    description: 'A high-energy dance track'
  },
  {
    id: 'hindi-upbeat-004',
    title: 'Lahore',
    artist: 'Guru Randhawa',
    album: 'Lahore',
    releaseDate: '2017-12-08',
    category: 'upbeat',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300',
    duration: '3:24',
    spotifyUrl: 'https://open.spotify.com/track/1BHGNd4yVpUV5QnLDqGnNR',
    tags: ['punjabi', 'upbeat', 'party'],
    description: 'An upbeat Punjabi party song'
  },
  {
    id: 'hindi-upbeat-005',
    title: 'Buzz',
    artist: 'Aastha Gill & Badshah',
    album: 'Buzz',
    releaseDate: '2018-07-13',
    category: 'energetic',
    language: 'Hindi',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    duration: '3:33',
    spotifyUrl: 'https://open.spotify.com/track/2Xr1dTzJee307rmB8gCJKs',
    tags: ['party', 'dance', 'pop'],
    description: 'A catchy pop-dance track perfect for parties'
  }
];

export const allAdditionalSongs = [
  ...additionalCalmSongs,
  ...additionalModerateSongs,
  ...additionalHindiCalmSongs,
  ...additionalHindiModerateSongs,
  ...additionalHindiUpbeatSongs
];
