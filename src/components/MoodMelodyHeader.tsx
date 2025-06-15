
import React from "react";
import { Music, Heart } from "lucide-react";

const MoodMelodyHeader = () => (
  <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
    <div className="relative">
      <Music
        className="h-12 w-12 text-gradient animate-pulse"
        style={{
          background: "linear-gradient(90deg,#a855f7 0%,#ec4899 45%,#3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      />
      <Heart className="h-6 w-6 text-pink-500 absolute -top-2 -right-2 animate-bounce" />
    </div>
    <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-500 to-blue-700 text-transparent bg-clip-text leading-tight tracking-wide drop-shadow-lg hover:scale-105 transition-all duration-200 [text-shadow:0_2px_16px_rgba(170,85,247,0.25)]">
      Mood <span className="text-pink-500">Melody</span>
    </h1>
  </div>
);

export default MoodMelodyHeader;
