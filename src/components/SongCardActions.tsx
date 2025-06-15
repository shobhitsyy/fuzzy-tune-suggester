import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Share, ListPlus } from "lucide-react";
import { addSongToDefaultPlaylist } from "@/services/playlistService";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Song } from "@/utils/fuzzyLogic";
import { supabase } from "@/integrations/supabase/client";

// Util for getting average and user rating for a song
async function getSongRatings(songId: string, userId?: string) {
  // Assume ratings are stored in 'song_ratings', structure: song_id, user_id, rating
  const { data: all, error } = await supabase
    .from("song_ratings")
    .select("rating, user_id")
    .eq("song_id", songId);

  if (error || !all) return { avg: null, count: 0, userRating: null };

  const count = all.length;
  const sum = all.reduce((acc, r) => acc + (r.rating || 0), 0);
  const avg = count ? sum / count : null;
  const userRating = userId ? all.find(({ user_id }) => user_id === userId)?.rating : null;

  return { avg, count, userRating };
}

// Save a rating (user can only rate once; upsert)
async function saveSongRating(songId: string, userId: string, rating: number) {
  return supabase.from("song_ratings").upsert([{ song_id: songId, user_id: userId, rating }], { onConflict: "song_id, user_id" });
}

interface SongCardActionsProps {
  song: Song;
}

const SongCardActions: React.FC<SongCardActionsProps> = ({ song }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [shared, setShared] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = useCurrentUser();

  // Fetch rating info on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSongRatings(song.id, user?.id).then(({ avg, count, userRating }) => {
      if (mounted) {
        setAvgRating(avg);
        setRatingCount(count);
        setRating(userRating || null);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [song.id, user?.id]);

  // Handle rating
  const handleRating = async (star: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      toast({ title: "Please log in to rate this song." });
      return;
    }
    if (rating !== null) {
      toast({ title: "You have already rated this song." });
      return;
    }
    setLoading(true);
    const { error } = await saveSongRating(song.id, user.id, star);
    if (!error) {
      setRating(star);
      getSongRatings(song.id, user?.id).then(({ avg, count }) => {
        setAvgRating(avg);
        setRatingCount(count);
      });
    }
    setLoading(false);
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
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${star <= (rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            onClick={loading || rating !== null ? undefined : (e) => handleRating(star, e)}
            strokeWidth={star <= (rating ?? 0) ? 0 : 2}
            fill={star <= (rating ?? 0) ? '#facc15' : 'none'}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: rating !== null ? "none" : "auto" }}
          />
        ))}
        <span className="ml-2 text-xs text-gray-600">
          {avgRating !== null
            ? `(${avgRating.toFixed(1)}/${ratingCount || 0})`
            : "(No reviews)"}
        </span>
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
