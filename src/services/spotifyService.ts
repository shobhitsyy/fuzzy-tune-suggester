
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

class SpotifyService {
  private config: SpotifyConfig;
  private accessToken: string | null = null;

  constructor() {
    this.config = {
      clientId: '', // Will be set from environment or user input
      redirectUri: `${window.location.origin}/callback`,
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
  }

  // Check if Spotify is configured and authenticated
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.config.clientId);
  }

  // Generate Spotify authorization URL
  getAuthUrl(): string {
    if (!this.config.clientId) {
      throw new Error('Spotify Client ID not configured');
    }

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

  // Search for tracks based on mood and preferences
  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Spotify');
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
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

  // Create a playlist
  async createPlaylist(name: string, description: string, trackUris: string[]): Promise<string> {
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

      // Add tracks to playlist
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
    localStorage.removeItem('spotify_access_token');
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyTrack };
