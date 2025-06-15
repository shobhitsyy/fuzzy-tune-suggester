import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Song } from "@/utils/fuzzyLogic";
import { Star, Share, ListPlus } from "lucide-react";
import { addSongToDefaultPlaylist } from "@/services/playlistService";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface SongCardProps {
  song: Song;
  onClick?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const [rating, setRating] = useState(0);
  const [shared, setShared] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const user = useCurrentUser();

  const openSpotify = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  // For demo: Share via navigator.share or clipboard
  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setShared(false);
    const text = `Check out "${song.title}" by ${song.artist}${song.spotifyUrl ? `: ${song.spotifyUrl}` : ''}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: song.title,
          text: text,
          url: song.spotifyUrl
        });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1200);
    } catch {
      setShared(false);
    }
  };

  // Rate the song (star rating)
  const handleRating = (star: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRating(star);
  };

  const handleAddToPlaylist = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      toast({ title: "Please log in to add to your playlist." });
      return;
    }
    setAdding(true);
    try {
      await addSongToDefaultPlaylist(user.id, song.id);
      setAddedToPlaylist(true);
      toast({
        title: "Added to Playlist",
        description: `'${song.title}' was added to your playlist.`,
      });
      setTimeout(() => setAddedToPlaylist(false), 1400);
    } catch (err: any) {
      toast({
        title: "Error adding song",
        description: err.message ?? "Could not add song to playlist.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card 
      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden group hover:scale-105"
      onClick={() => onClick?.(song)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img 
          src={song.coverImage} 
          alt={`${song.title} by ${song.artist}`} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 sm:p-3">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="bg-white/20 backdrop-blur text-white border-0 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
              {song.category}
            </Badge>
            {/* No info/expand action */}
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/80">{song.duration}</span>
              {song.spotifyUrl && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full h-6 w-6 sm:h-8 sm:w-8"
                  onClick={openSpotify}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="white" fillOpacity={0.2} />
                    <polygon points="9,7 18,12 9,17" fill="white" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="font-medium truncate text-xs sm:text-sm leading-tight text-gray-800">{song.title}</h3>
          <p className="text-xs text-gray-500 truncate">{song.artist}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 capitalize">{song.language}</span>
            {song.spotifyUrl && (
              <Button
                variant="outline"
                size="sm"
                className="h-5 px-2 sm:h-6 sm:px-2 text-xs text-green-600 border-green-200 hover:bg-green-50"
                onClick={openSpotify}
              >
                <span className="sm:hidden">Play</span>
                <span className="hidden sm:inline">Spotify</span>
              </Button>
            )}
          </div>
        </div>

        {/* Song Actions */}
        <div className="flex gap-2 mt-2 items-center justify-center">
          {/* Star Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                onClick={(e) => handleRating(star, e)}
                strokeWidth={star <= rating ? 0 : 2}
                fill={star <= rating ? '#facc15' : 'none'}
              />
            ))}
          </div>
          {/* Share */}
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full transition-colors ${shared ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50'}`}
            onClick={handleShare}
          >
            <Share className="h-5 w-5" />
          </Button>
          {/* Add to Playlist */}
          {user && (
            <Button
              size="icon"
              variant="ghost"
              className={`rounded-full transition-colors ${addedToPlaylist ? 'bg-green-100 text-green-600' : 'hover:bg-green-50'}`}
              onClick={handleAddToPlaylist}
              disabled={adding}
            >
              <ListPlus className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Tags */}
        {song.tags && song.tags.length > 0 && (
          <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center pt-0.5 sm:pt-1">
            {song.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs py-0 px-1 sm:px-1.5 h-4 sm:h-5 bg-gray-100 text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongCard;
