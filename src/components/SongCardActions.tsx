
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Share, ListPlus } from "lucide-react";
import { addSongToDefaultPlaylist } from "@/services/playlistService";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Song } from "@/utils/fuzzyLogic";

interface SongCardActionsProps {
  song: Song;
}

const SongCardActions: React.FC<SongCardActionsProps> = ({ song }) => {
  const [rating, setRating] = useState(0);
  const [shared, setShared] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const user = useCurrentUser();

  // Star rating
  const handleRating = (star: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRating(star);
  };

  // Share action
  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setShared(false);
    const text = `Check out "${song.title}" by ${song.artist}${song.spotifyUrl ? `: ${song.spotifyUrl}` : ''}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: song.title,
          text: text,
          url: song.spotifyUrl,
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

  // Add to playlist
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
    <div className="flex gap-2 mt-2 items-center justify-center">
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
      <Button
        size="icon"
        variant="ghost"
        className={`rounded-full transition-colors ${shared ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50'}`}
        onClick={handleShare}
      >
        <Share className="h-5 w-5" />
      </Button>
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
  );
};

export default SongCardActions;
