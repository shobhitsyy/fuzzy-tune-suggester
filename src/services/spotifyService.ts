
// Spotify API integration service
interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { 
    name: string; 
    images: Array<{ url: string }> 
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

  constructor() {
    this.config = {
      clientId: '', // Will be set from environment or user input
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
  }

  // Set Spotify client ID (to be called when user provides credentials)
  setClientId(clientId: string) {
    this.config.clientId = clientId;
    localStorage.setItem('spotify_client_id', clientId);
  }

  // Get stored client ID
  getClientId(): string {
    return this.config.clientId || localStorage.getItem('spotify_client_id') || '';
  }

  // Check if Spotify is configured and authenticated
  isAuthenticated(): boolean {
    const clientId = this.getClientId();
    return !!(this.accessToken && clientId);
  }

  // Generate Spotify authorization URL
  getAuthUrl(): string {
    const clientId = this.getClientId();
    if (!clientId) {
      throw new Error('Spotify Client ID not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
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

  // Search for tracks based on mood and preferences
  async searchTracks(params: SpotifySearchParams): Promise<SpotifyTrack[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Spotify');
    }

    try {
      let query = '';
      
      // Build query based on mood parameters
      if (params.mood) {
        query += `genre:"${params.mood}" `;
      }
      
      // Add language-specific search terms
      if (params.language === 'hindi') {
        query += 'market:IN ';
      } else if (params.language === 'english') {
        query += 'market:US ';
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${params.limit || 20}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Spotify session expired. Please reconnect.');
        }
        throw new Error('Failed to search Spotify tracks');
      }

      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  // Get audio features for tracks
  async getAudioFeatures(trackIds: string[]): Promise<any[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Spotify');
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get audio features');
      }

      const data = await response.json();
      return data.audio_features;
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

  // Get user's current playback state
  async getCurrentPlayback() {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.status === 204) {
        return null; // No active device
      }

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get playback error:', error);
      return null;
    }
  }

  // Logout and clear tokens
  logout() {
    this.accessToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_client_id');
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyTrack, SpotifySearchParams };
