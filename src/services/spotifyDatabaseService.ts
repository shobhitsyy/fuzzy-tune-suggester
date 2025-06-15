
import { supabase } from '@/integrations/supabase/client';
import { spotifyService, SpotifyTrack } from '@/services/spotifyService';
import { Song, SongCategory } from '@/utils/fuzzyLogic';

interface SpotifyAudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
}

interface EnrichmentResult {
  updated: number;
  newSongs: number;
  errors: number;
}

export class SpotifyDatabaseService {
  
  // Enrich existing songs with Spotify data
  async enrichExistingSongs(batchSize: number = 10): Promise<EnrichmentResult> {
    const result: EnrichmentResult = { updated: 0, newSongs: 0, errors: 0 };
    
    try {
      // Get songs without Spotify URLs or with incomplete data
      const { data: songsToEnrich, error } = await supabase
        .from('songs')
        .select('*')
        .or('spotify_url.is.null,cover_image.is.null')
        .limit(batchSize);

      if (error) throw error;
      if (!songsToEnrich || songsToEnrich.length === 0) {
        console.log('No songs need enrichment');
        return result;
      }

      console.log(`Enriching ${songsToEnrich.length} songs with Spotify data...`);

      for (const song of songsToEnrich) {
        try {
          // Search for the song on Spotify
          const searchQuery = `track:"${song.title}" artist:"${song.artist}"`;
          const searchResults = await this.searchSpotifyTrack(searchQuery);
          
          if (searchResults.length > 0) {
            const spotifyTrack = searchResults[0];
            const audioFeatures = await this.getTrackAudioFeatures(spotifyTrack.id);
            
            // Update the song with Spotify data
            const updateData: any = {
              spotify_url: spotifyTrack.external_urls.spotify,
              cover_image: spotifyTrack.album.images[0]?.url || song.cover_image,
              updated_at: new Date().toISOString()
            };

            // Add audio features to tags if available
            if (audioFeatures) {
              const audioTags = this.generateAudioFeatureTags(audioFeatures);
              updateData.tags = [...new Set([...(song.tags || []), ...audioTags])];
            }

            const { error: updateError } = await supabase
              .from('songs')
              .update(updateData)
              .eq('id', song.id);

            if (updateError) throw updateError;
            
            result.updated++;
            console.log(`Updated: ${song.title} by ${song.artist}`);
            
            // Rate limiting - wait between requests
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Error enriching song ${song.title}:`, error);
          result.errors++;
        }
      }

      return result;
    } catch (error) {
      console.error('Error in enrichExistingSongs:', error);
      throw error;
    }
  }

  // Discover and add new songs based on existing songs in the database
  async discoverNewSongs(category: SongCategory, count: number = 20): Promise<EnrichmentResult> {
    const result: EnrichmentResult = { updated: 0, newSongs: 0, errors: 0 };
    
    try {
      // Get existing songs from the category to use as seeds
      const { data: seedSongs, error } = await supabase
        .from('songs')
        .select('*')
        .eq('category', category)
        .not('spotify_url', 'is', null)
        .limit(5);

      if (error) throw error;
      if (!seedSongs || seedSongs.length === 0) {
        console.log(`No seed songs found for category: ${category}`);
        return result;
      }

      // Extract Spotify track IDs from seed songs
      const seedTrackIds = seedSongs
        .map(song => this.extractSpotifyTrackId(song.spotify_url))
        .filter(Boolean)
        .slice(0, 5);

      if (seedTrackIds.length === 0) {
        console.log('No valid Spotify track IDs found in seed songs');
        return result;
      }

      // Get recommendations from Spotify
      const recommendations = await this.getSpotifyRecommendations(seedTrackIds, count);
      
      for (const track of recommendations) {
        try {
          // Check if song already exists
          const { data: existingSong } = await supabase
            .from('songs')
            .select('id')
            .eq('spotify_url', track.external_urls.spotify)
            .single();

          if (!existingSong) {
            // Get audio features for better categorization
            const audioFeatures = await this.getTrackAudioFeatures(track.id);
            const newSong = this.convertSpotifyTrackToSong(track, category, audioFeatures);
            
            const { error: insertError } = await supabase
              .from('songs')
              .insert(newSong);

            if (insertError) throw insertError;
            
            result.newSongs++;
            console.log(`Added new song: ${track.name} by ${track.artists[0].name}`);
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error adding song ${track.name}:`, error);
          result.errors++;
        }
      }

      return result;
    } catch (error) {
      console.error('Error in discoverNewSongs:', error);
      throw error;
    }
  }

  // Update all song categories with fresh Spotify recommendations
  async updateAllCategories(): Promise<Record<SongCategory, EnrichmentResult>> {
    const categories: SongCategory[] = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivational'];
    const results: Record<SongCategory, EnrichmentResult> = {} as Record<SongCategory, EnrichmentResult>;

    for (const category of categories) {
      try {
        console.log(`Updating category: ${category}`);
        results[category] = await this.discoverNewSongs(category, 10);
        
        // Wait between categories to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error updating category ${category}:`, error);
        results[category] = { updated: 0, newSongs: 0, errors: 1 };
      }
    }

    return results;
  }

  // Helper methods
  private async searchSpotifyTrack(query: string): Promise<SpotifyTrack[]> {
    try {
      return await spotifyService.searchTracks({ 
        mood: query,
        limit: 5 
      });
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  }

  private async getTrackAudioFeatures(trackId: string): Promise<SpotifyAudioFeatures | null> {
    try {
      const features = await spotifyService.getAudioFeatures([trackId]);
      return features[0] || null;
    } catch (error) {
      console.error('Audio features error:', error);
      return null;
    }
  }

  private async getSpotifyRecommendations(seedTrackIds: string[], limit: number): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrackIds.join(',')}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${spotifyService['accessToken']}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to get recommendations');
      
      const data = await response.json();
      return data.tracks || [];
    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }

  private extractSpotifyTrackId(spotifyUrl: string | null): string | null {
    if (!spotifyUrl) return null;
    const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  private generateAudioFeatureTags(features: SpotifyAudioFeatures): string[] {
    const tags: string[] = [];
    
    if (features.energy > 0.7) tags.push('high-energy');
    if (features.energy < 0.3) tags.push('low-energy');
    if (features.valence > 0.7) tags.push('positive');
    if (features.valence < 0.3) tags.push('melancholic');
    if (features.danceability > 0.7) tags.push('danceable');
    if (features.acousticness > 0.7) tags.push('acoustic');
    if (features.instrumentalness > 0.5) tags.push('instrumental');
    
    return tags;
  }

  private convertSpotifyTrackToSong(
    track: SpotifyTrack, 
    category: SongCategory, 
    audioFeatures: SpotifyAudioFeatures | null
  ): any {
    const tags = ['spotify'];
    if (audioFeatures) {
      tags.push(...this.generateAudioFeatureTags(audioFeatures));
    }

    return {
      id: `spotify_${track.id}`,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      release_date: track.album.release_date || '2024-01-01',
      language: 'English', // Default, could be improved with language detection
      category,
      cover_image: track.album.images[0]?.url || '',
      duration: this.formatDuration(track.duration_ms),
      spotify_url: track.external_urls.spotify,
      tags,
      description: `Discovered via Spotify recommendations. ${audioFeatures ? `Energy: ${Math.round(audioFeatures.energy * 100)}%, Mood: ${Math.round(audioFeatures.valence * 100)}%` : ''}`
    };
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const spotifyDatabaseService = new SpotifyDatabaseService();
