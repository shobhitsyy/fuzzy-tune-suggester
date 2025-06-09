
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Song } from "@/utils/fuzzyLogic";
import { Play, Info, ThumbsUp, ThumbsDown, Heart, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
  onFeedback?: (songId: string, rating: 'like' | 'dislike' | 'love', feedback?: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, onFeedback }) => {
  const [userRating, setUserRating] = useState<'like' | 'dislike' | 'love' | null>(null);
  const { toast } = useToast();

  const handleFeedback = (type: 'like' | 'dislike' | 'love', event: React.MouseEvent) => {
    event.stopPropagation();
    setUserRating(type);
    onFeedback?.(song.id, type);
    
    // Save feedback to localStorage for learning
    const feedback = JSON.parse(localStorage.getItem('songFeedback') || '{}');
    feedback[song.id] = { type, timestamp: new Date().toISOString(), song };
    localStorage.setItem('songFeedback', JSON.stringify(feedback));
    
    toast({
      title: "Feedback Recorded",
      description: `Thanks for rating "${song.title}"!`,
    });
  };

  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} by ${song.artist}`,
          text: `Check out this song: ${song.title} by ${song.artist}`,
          url: song.spotifyUrl || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const shareText = `Check out this song: ${song.title} by ${song.artist} ${song.spotifyUrl || ''}`;
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Song details copied to clipboard!",
      });
    }
  };

  const openSpotify = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  return (
    <Card 
      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden group hover:scale-105"
      onClick={() => onClick(song)}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/20 backdrop-blur hover:bg-white/40 text-white rounded-full h-6 w-6 sm:h-8 sm:w-8"
              onClick={(e) => {
                e.stopPropagation();
                onClick(song);
              }}
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
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
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" fill="white" />
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
          </div>
        </div>

        {/* Mobile-Optimized Feedback Buttons */}
        <div className="flex gap-0.5 sm:gap-1 justify-center pt-1 sm:pt-2">
          <Button
            variant={userRating === 'like' ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-1.5 sm:h-7 sm:px-2 text-xs border-gray-200 hover:bg-gray-50"
            onClick={(e) => handleFeedback('like', e)}
          >
            <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
          <Button
            variant={userRating === 'dislike' ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-1.5 sm:h-7 sm:px-2 text-xs border-gray-200 hover:bg-gray-50"
            onClick={(e) => handleFeedback('dislike', e)}
          >
            <ThumbsDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
          <Button
            variant={userRating === 'love' ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-1.5 sm:h-7 sm:px-2 text-xs text-red-500 border-red-200 hover:bg-red-50"
            onClick={(e) => handleFeedback('love', e)}
          >
            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-1.5 sm:h-7 sm:px-2 text-xs border-gray-200 hover:bg-gray-50"
            onClick={handleShare}
          >
            <Share2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
          {song.spotifyUrl && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-1.5 sm:h-7 sm:px-2 text-xs text-green-600 border-green-200 hover:bg-green-50"
              onClick={openSpotify}
            >
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          )}
        </div>

        {/* Mobile-Optimized Tags */}
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
