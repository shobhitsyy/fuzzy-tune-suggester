
import React, { useState, useEffect } from "react";
import MoodSelector from "@/components/MoodSelector";
import SongCard from "@/components/SongCard";
import SongDetail from "@/components/SongDetail";
import { MoodParams, SongCategory, determineSongCategory } from "@/utils/fuzzyLogic";
import { Song, getRecommendedSongs } from "@/utils/songData";
import { Button } from "@/components/ui/card";

const Index = () => {
  const [moodParams, setMoodParams] = useState<MoodParams>({
    heartRate: 70,
    timeOfDay: new Date().getHours(),
    activity: 5,
    mood: 5,
  });
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [includeEnglish, setIncludeEnglish] = useState<boolean>(true);
  const [includeHindi, setIncludeHindi] = useState<boolean>(true);
  const [category, setCategory] = useState<SongCategory | null>(null);
  
  // Generate recommendations based on mood parameters
  const generateRecommendations = () => {
    const { category: newCategory } = determineSongCategory(moodParams);
    setCategory(newCategory);
    
    const recommendations = getRecommendedSongs(
      moodParams, 
      8, 
      includeEnglish, 
      includeHindi
    );
    
    setSongs(recommendations);
    setShowResults(true);
  };
  
  // Handle song selection
  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
    setIsDetailOpen(true);
  };
  
  // Close detail view
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  
  // Select a similar song
  const handleSelectSimilar = (song: Song) => {
    setSelectedSong(song);
  };
  
  // Back to mood selection
  const handleBackToSelector = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Music Mood Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Discover personalized music recommendations based on your current mood and activity.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl px-4 pb-16">
        {!showResults ? (
          <div className="max-w-md mx-auto py-8">
            <MoodSelector 
              onParametersChange={setMoodParams} 
              onSubmit={generateRecommendations} 
            />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Music Recommendations</h2>
                <p className="text-muted-foreground">
                  Based on your {category?.toLowerCase()} mood
                </p>
              </div>
              <button 
                onClick={handleBackToSelector}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Adjust Mood
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {songs.map((song, index) => (
                <div 
                  key={song.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SongCard song={song} onClick={handleSongClick} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Song Detail Dialog */}
      <SongDetail
        song={selectedSong}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onSelectSimilar={handleSelectSimilar}
      />
    </div>
  );
};

export default Index;
