
import React, { useState, useEffect } from "react";
import { Song } from "@/utils/fuzzyLogic";
import { getSimilarSongs } from "@/services/songService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, Music, Play, X } from "lucide-react";

interface SongDetailProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSimilar: (song: Song) => void;
}

const SongDetail: React.FC<SongDetailProps> = ({
  song,
  isOpen,
  onClose,
  onSelectSimilar,
}) => {
  const [similarSongs, setSimilarSongs] = useState<Song[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  // Fetch similar songs when song changes
  useEffect(() => {
    const fetchSimilarSongs = async () => {
      if (!song) {
        setSimilarSongs([]);
        return;
      }

      setIsLoadingSimilar(true);
      try {
        const similar = await getSimilarSongs(song.id, 3);
        setSimilarSongs(similar);
      } catch (error) {
        console.error('Error fetching similar songs:', error);
        setSimilarSongs([]);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    if (isOpen && song) {
      fetchSimilarSongs();
    }
  }, [song, isOpen]);

  if (!song) return null;
  
  // Function to open Spotify app with the song
  const openInSpotify = (url: string) => {
    // Extract the Spotify track ID from the URL
    const spotifyIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    const spotifyId = spotifyIdMatch ? spotifyIdMatch[1] : null;
    
    if (spotifyId) {
      // Create a Spotify URI that will open in the app
      const spotifyUri = `spotify:track:${spotifyId}`;
      
      // Try to open the Spotify app first
      window.location.href = spotifyUri;
      
      // Fallback to the web URL after a short delay (in case app is not installed)
      setTimeout(() => {
        // Check if we're still on the same page (app didn't open)
        window.open(url, "_blank");
      }, 1000);
    } else {
      // If we can't extract the ID, just open the URL in browser
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 rounded-xl overflow-hidden border-0 shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30 z-10" />
          <img
            src={song.coverImage}
            alt={`${song.title} by ${song.artist}`}
            className="w-full h-64 object-cover object-center"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-0 left-0 p-6 z-20">
            <h2 className="text-white text-3xl font-bold mb-1">{song.title}</h2>
            <p className="text-white/80 text-xl">{song.artist}</p>
          </div>
        </div>

        <ScrollArea className="p-6 max-h-[60vh]">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <DialogTitle className="text-xl">Song Details</DialogTitle>
              </div>

              <div className="grid grid-cols-2 gap-y-3">
                <div className="text-sm text-muted-foreground">Album</div>
                <div className="text-sm font-medium">{song.album}</div>

                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {song.duration}
                </div>

                <div className="text-sm text-muted-foreground">Release Date</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {song.releaseDate}
                </div>

                <div className="text-sm text-muted-foreground">Language</div>
                <div className="text-sm font-medium capitalize">{song.language}</div>

                <div className="text-sm text-muted-foreground">Category</div>
                <div className="text-sm font-medium capitalize">{song.category}</div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {song.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {song.spotifyUrl && (
                <Button
                  className="w-full mt-4 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white gap-2"
                  onClick={() => openInSpotify(song.spotifyUrl!)}
                >
                  <Play className="h-4 w-4" fill="white" />
                  Play on Spotify
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <DialogDescription className="text-foreground">
                {song.description}
              </DialogDescription>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Similar Songs</h4>
                {isLoadingSimilar ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3 p-2">
                        <div className="w-12 h-12 rounded-md bg-gray-200"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : similarSongs.length > 0 ? (
                  <div className="space-y-3">
                    {similarSongs.map((similar) => (
                      <div
                        key={similar.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => onSelectSimilar(similar)}
                      >
                        <img
                          src={similar.coverImage}
                          alt={similar.title}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{similar.title}</h5>
                          <p className="text-sm text-muted-foreground truncate">
                            {similar.artist}
                          </p>
                        </div>
                        {similar.spotifyUrl && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              openInSpotify(similar.spotifyUrl!);
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No similar songs found.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="bg-muted/30 p-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SongDetail;
