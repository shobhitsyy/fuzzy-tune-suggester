
import React, { useEffect, useState } from "react";
import { addSongsListToDatabase } from "@/services/spotifyDatabaseService";

const SONGS_TO_ADD = [
  // English Songs
  { name: "Blinding Lights", artist: "The Weeknd", category: "energetic", language: "English" },
  { name: "Watermelon Sugar", artist: "Harry Styles", category: "upbeat", language: "English" },
  { name: "Levitating", artist: "Dua Lipa", category: "energetic", language: "English" },
  { name: "Good 4 U", artist: "Olivia Rodrigo", category: "upbeat", language: "English" },
  { name: "Stay", artist: "The Kid LAROI", category: "moderate", language: "English" },

  // Hindi Songs
  { name: "Kesariya", artist: "Arijit Singh", category: "relaxed", language: "Hindi" },
  { name: "Raataan Lambiyan", artist: "Tanishk Bagchi", category: "calm", language: "Hindi" },
  { name: "Mann Meri Jaan", artist: "King", category: "upbeat", language: "Hindi" },
  { name: "Apna Bana Le", artist: "Arijit Singh", category: "relaxed", language: "Hindi" },
  { name: "Baarish Ban Jaana", artist: "Stebin Ben", category: "calm", language: "Hindi" }
];

const SeedSongInserter: React.FC = () => {
  const [status, setStatus] = useState<null | "running" | "success" | "error">(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let active = true;
    setStatus("running");
    setMessage("Running seeder...");

    addSongsListToDatabase(SONGS_TO_ADD)
      .then((result) => {
        if (!active) return;
        setStatus("success");
        setMessage(`Seeder complete! Result: ${JSON.stringify(result)}`);
        // Optionally: remove this component automatically, or set a timeout to show the result
      })
      .catch((err) => {
        if (!active) return;
        setStatus("error");
        setMessage(`Seeder error: ${err?.message || err}`);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="max-w-xl mx-auto mt-8 p-4 border-2 border-dashed rounded bg-yellow-50 text-yellow-900"
      style={{ zIndex: 1000, position: "relative" }}
    >
      <div className="font-bold mb-2">Song Seeder Utility (REMOVE when finished!)</div>
      <div className={status === "error" ? "text-red-700" : "text-gray-700"}>
        {message}
      </div>
    </div>
  );
};

export default SeedSongInserter;
