
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Heart, Share2, ExternalLink, Star } from 'lucide-react';
import { Song } from '@/utils/fuzzyLogic';
import { useToast } from '@/hooks/use-toast';

interface SongFeedbackProps {
  song: Song;
  onFeedback?: (songId: string, rating: 'like' | 'dislike' | 'love', feedback?: string) => void;
}

const SongFeedback = ({ song, onFeedback }: SongFeedbackProps) => {
  const [userRating, setUserRating] = useState<'like' | 'dislike' | 'love' | null>(null);
  const [hasShared, setHasShared] = useState(false);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleFeedback = (type: 'like' | 'dislike' | 'love') => {
    setUserRating(type);
    onFeedback?.(song.id, type);
    
    // Save feedback to localStorage for learning
    const feedback = JSON.parse(localStorage.getItem('songFeedback') || '{}');
    feedback[song.id] = { type, timestamp: new Date().toISOString(), song };
    localStorage.setItem('songFeedback', JSON.stringify(feedback));
    
    toast({
      title: "Feedback Recorded",
      description: `Thanks for rating "${song.title}"! This helps improve future recommendations.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} by ${song.artist}`,
          text: `Check out this song I found: ${song.title} by ${song.artist}`,
          url: song.spotifyUrl || window.location.href,
        });
        setHasShared(true);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      const shareText = `Check out this song: ${song.title} by ${song.artist} ${song.spotifyUrl || ''}`;
      await navigator.clipboard.writeText(shareText);
      setHasShared(true);
      toast({
        title: "Copied to Clipboard",
        description: "Song details copied to clipboard!",
      });
    }
  };

  const handleStarRating = (stars: number) => {
    setRating(stars);
    onFeedback?.(song.id, stars >= 4 ? 'love' : stars >= 3 ? 'like' : 'dislike');
  };

  const openSpotify = () => {
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{song.title}</h3>
            <p className="text-gray-600 truncate">{song.artist}</p>
            <p className="text-sm text-gray-500">{song.album} • {song.duration}</p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {song.category}
          </Badge>
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Rate this song:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => handleStarRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Quick Feedback Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={userRating === 'like' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('like')}
            className="flex items-center space-x-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </Button>
          <Button
            variant={userRating === 'dislike' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('dislike')}
            className="flex items-center space-x-1"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Dislike</span>
          </Button>
          <Button
            variant={userRating === 'love' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('love')}
            className="flex items-center space-x-1 text-red-500 border-red-500 hover:bg-red-50"
          >
            <Heart className="h-4 w-4" />
            <span>Love</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-1"
          >
            <Share2 className="h-4 w-4" />
            <span>{hasShared ? 'Shared!' : 'Share'}</span>
          </Button>
          {song.spotifyUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={openSpotify}
              className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in Spotify</span>
            </Button>
          )}
        </div>

        {/* Tags */}
        {song.tags && song.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {song.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {song.description && (
          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {song.description}
          </div>
        )}

        {/* Why this song? */}
        <div className="mt-3 text-xs text-gray-500 italic">
          💡 Recommended because: Matches your {song.category.toLowerCase()} mood and current preferences
        </div>
      </CardContent>
    </Card>
  );
};

export default SongFeedback;
