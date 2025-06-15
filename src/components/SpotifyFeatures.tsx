
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spotifyService } from '@/services/spotifyService';
import { useToast } from '@/hooks/use-toast';
import { PlaylistPlus, Search, Music } from 'lucide-react';
import { Song } from '@/utils/fuzzyLogic';

interface SpotifyFeaturesProps {
  recommendedSongs: Song[];
  currentMood: any;
}

const SpotifyFeatures: React.FC<SpotifyFeaturesProps> = ({ recommendedSongs, currentMood }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast({
        title: "Playlist Name Required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
      });
      return;
    }

    if (recommendedSongs.length === 0) {
      toast({
        title: "No Songs to Add",
        description: "Generate some music recommendations first.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPlaylist(true);

    try {
      const moodDescription = `Heart Rate: ${currentMood.heartRate}, Activity: ${currentMood.activity}/10, Mood: ${currentMood.mood}/10`;
      const playlistUrl = await spotifyService.createMoodPlaylist(
        playlistName,
        recommendedSongs,
        moodDescription
      );

      toast({
        title: "Playlist Created!",
        description: `"${playlistName}" has been added to your Spotify account.`,
      });

      // Open playlist in new tab
      window.open(playlistUrl, '_blank');
      setPlaylistName('');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Playlist Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleSearchSpotify = async () => {
    setIsSearching(true);

    try {
      const results = await spotifyService.searchTracks({
        mood: 'pop',
        energy: currentMood.activity / 10,
        valence: currentMood.mood / 10,
        limit: 10
      });

      console.log('Spotify search results:', results);
      
      toast({
        title: "Spotify Search Complete",
        description: `Found ${results.length} tracks matching your mood on Spotify.`,
      });
    } catch (error) {
      console.error('Spotify search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search Spotify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (!spotifyService.isAuthenticated()) {
    return null;
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Music className="h-5 w-5" />
          Spotify Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Create Playlist */}
          <div className="space-y-3">
            <Label htmlFor="playlistName" className="text-sm font-medium">
              Create Mood Playlist
            </Label>
            <div className="flex gap-2">
              <Input
                id="playlistName"
                type="text"
                placeholder="My Mood Playlist"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={isCreatingPlaylist || !playlistName.trim()}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isCreatingPlaylist ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <PlaylistPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Creates a playlist with your current recommendations ({recommendedSongs.length} songs)
            </p>
          </div>

          {/* Search Spotify */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Discover on Spotify
            </Label>
            <Button
              onClick={handleSearchSpotify}
              disabled={isSearching}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Find Similar Songs</span>
                </div>
              )}
            </Button>
            <p className="text-xs text-gray-600">
              Search Spotify for songs matching your current mood
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyFeatures;
