
// Spotify API integration service
interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { 
    name: string; 
    images: Array<{ url: string }>;
    release_date?: string;
  };
  duration_ms: number;
  external_urls: { spotify: string };
  audio_features?: {
    energy: number;
    valence: number;
    danceability: number;
    acousticness: number;
  };
}

interface SpotifySearchParams {
  mood?: string;
  energy?: number;
  valence?: number;
  language?: 'english' | 'hindi' | 'both';
  limit?: number;
}

class SpotifyService {
  private config: SpotifyConfig;
  private accessToken: string | null = null;
  private clientCredentialsToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  constructor() {
    this.config = {
      clientId: '7d5065f77c664bf8a372d424bca4c0ca',
      clientSecret: 'ebee3f74a79b491e8ac818185627db9f',
      redirectUri: `${window.location.origin}`,
      scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
      ]
    };
    
    // Try to get existing token from localStorage
    this.accessToken = localStorage.getItem('spotify_access_token');
    const expiryTime = localStorage.getItem('spotify_token_expiry');
    this.tokenExpiryTime = expiryTime ? parseInt(expiryTime) : null;
  }

  // Check if token is expired
  private isTokenExpired(): boolean {
    if (!this.tokenExpiryTime) return true;
    return Date.now() > this.tokenExpiryTime;
  }

  // Get client credentials token for API access without user auth
  async getClientCredentialsToken(): Promise<string> {
    // Check if we have a valid token
    if (this.clientCredentialsToken && !this.isTokenExpired()) {
      console.log('Using existing valid Spotify token');
      return this.clientCredentialsToken;
    }

    try {
      console.log('Requesting new Spotify client credentials token...');
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify token request failed:', response.status, errorText);
        throw new Error(`Failed to get client credentials token: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      this.clientCredentialsToken = data.access_token;
      
      // Set expiry time (tokens typically last 1 hour)
      const expiresIn = data.expires_in || 3600; // Default to 1 hour
      this.tokenExpiryTime = Date.now() + (expiresIn * 1000);
      
      // Store in localStorage for persistence
      localStorage.setItem('spotify_client_token', this.clientCredentialsToken);
      localStorage.setItem('spotify_token_expiry', this.tokenExpiryTime.toString());
      
      console.log('Successfully obtained Spotify client credentials token');
      return this.clientCredentialsToken;
    } catch (error) {
      console.error('Error getting client credentials token:', error);
      throw error;
    }
  }

  // Set Spotify client ID (backwards compatibility)
  setClientId(clientId: string) {
    this.config.clientId = clientId;
    localStorage.setItem('spotify_client_id', clientId);
  }

  // Get client ID
  getClientId(): string {
    return this.config.clientId;
  }

  // Check if Spotify is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Check if we can make API calls (either user auth or client credentials)
  async canMakeApiCalls(): Promise<boolean> {
    if (this.accessToken) {
      return true;
    }
    try {
      await this.getClientCredentialsToken();
      return true;
    } catch (error) {
      console.error('Cannot make Spotify API calls:', error);
      return false;
    }
  }

  // Generate Spotify authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'token',
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Handle callback and extract token
  handleCallback(): boolean {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    
    if (token) {
      this.accessToken = token;
      localStorage.setItem('spotify_access_token', token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  }

  // Get appropriate token for API calls
  private async getApiToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }
    return await this.getClientCredentialsToken();
  }

  // Search for tracks based on mood and preferences
  async searchTracks(params: SpotifySearchParams): Promise<SpotifyTrack[]> {
    try {
      console.log('Searching Spotify tracks with params:', params);
      const token = await this.getApiToken();
      let query = '';
      
      // Build query based on mood parameters
      if (params.mood) {
        query += `${params.mood} `;
      }
      
      // Add language-specific search terms
      if (params.language === 'hindi') {
        query += 'market:IN ';
      } else if (params.language === 'english') {
        query += 'market:US ';
      }

      const searchQuery = encodeURIComponent(query.trim() || 'pop');
      const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=${params.limit || 20}`;
      
      console.log('Making Spotify API request to:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify search failed:', response.status, errorText);
        
        if (response.status === 401) {
          this.logout();
          throw new Error('Spotify session expired. Please reconnect.');
        }
        throw new Error(`Failed to search Spotify tracks: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Spotify search response:', data.tracks?.items?.length || 0, 'tracks found');
      return data.tracks.items || [];
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  // Search for specific track by name and artist
  async searchSpecificTrack(trackName: string, artistName: string): Promise<SpotifyTrack | null> {
    try {
      console.log(`Searching for specific track: "${trackName}" by "${artistName}"`);
      const token = await this.getApiToken();
      const query = `track:"${trackName}" artist:"${artistName}"`;
      const searchQuery = encodeURIComponent(query);
      const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`;
      
      console.log('Making specific track search to:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify specific track search failed:', response.status, errorText);
        throw new Error(`Failed to search for specific track: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const track = data.tracks.items[0] || null;
      
      if (track) {
        console.log(`Found track: ${track.name} by ${track.artists[0]?.name}`);
      } else {
        console.log(`No track found for: "${trackName}" by "${artistName}"`);
      }
      
      return track;
    } catch (error) {
      console.error('Error searching for specific track:', error);
      return null;
    }
  }

  // Get audio features for tracks
  async getAudioFeatures(trackIds: string[]): Promise<any[]> {
    try {
      const token = await this.getApiToken();

      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get audio features');
      }

      const data = await response.json();
      return data.audio_features || [];
    } catch (error) {
      console.error('Audio features error:', error);
      throw error;
    }
  }

  // Create a playlist based on mood recommendations
  async createMoodPlaylist(name: string, songs: any[], moodDescription: string): Promise<string> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Spotify');
    }

    try {
      // First get user profile
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const user = await userResponse.json();

      // Create playlist
      const description = `Mood-based playlist: ${moodDescription}. Created by Music Mood Generator.`;
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            public: false
          })
        }
      );

      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
      }

      const playlist = await playlistResponse.json();

      // Convert songs to Spotify URIs and add them
      const trackUris = songs
        .filter(song => song.spotifyUrl)
        .map(song => {
          const trackId = song.spotifyUrl.split('/').pop()?.split('?')[0];
          return trackId ? `spotify:track:${trackId}` : null;
        })
        .filter(Boolean)
        .slice(0, 50); // Spotify limit

      if (trackUris.length > 0) {
        await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackUris
          })
        });
      }

      return playlist.external_urls.spotify;
    } catch (error) {
      console.error('Create playlist error:', error);
      throw error;
    }
  }

  // Logout and clear tokens
  logout() {
    this.accessToken = null;
    this.clientCredentialsToken = null;
    this.tokenExpiryTime = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_client_id');
    localStorage.removeItem('spotify_client_token');
    localStorage.removeItem('spotify_token_expiry');
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyTrack, SpotifySearchParams };
