
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Song } from "@/utils/fuzzyLogic";
import LyricSnippet from "@/components/LyricSnippet";
import SongCardActions from "@/components/SongCardActions";
import SongCardTags from "@/components/SongCardTags";

interface SongCardProps {
  song: Song;
  onClick?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const openSpotify = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
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
          <LyricSnippet title={song.title} artist={song.artist} />
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
        <SongCardActions song={song} />
        <SongCardTags tags={song.tags} />
      </CardContent>
    </Card>
  );
};

export default SongCard;
