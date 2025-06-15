
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Song } from "@/utils/songData";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <Card 
      className="music-card relative overflow-hidden group border-0 rounded-xl"
      onClick={() => onClick(song)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full h-10 w-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Info className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h3 className="font-semibold text-white text-lg truncate">{song.title}</h3>
          <p className="text-white/80 text-sm truncate">{song.artist}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-white/60">{song.duration}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 w-10 shadow-lg"
            >
              <Play className="h-5 w-5" fill="white" />
            </Button>
          </div>
        </div>
      </div>
      <div className="aspect-square overflow-hidden bg-secondary">
        <img 
          src={song.coverImage} 
          alt={`${song.title} by ${song.artist}`} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">{song.language}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {song.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;
