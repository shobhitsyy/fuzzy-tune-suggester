import { useEffect } from "react";
import { addSongsListToDatabase } from "@/services/spotifyDatabaseService";

const SONGS = [
  { name: "Blinding Lights", artist: "The Weeknd", category: "Energetic", language: "English" },
  { name: "Watermelon Sugar", artist: "Harry Styles", category: "Upbeat", language: "English" },
  { name: "Levitating", artist: "Dua Lipa", category: "Energetic", language: "English" },
  { name: "Good 4 U", artist: "Olivia Rodrigo", category: "Upbeat", language: "English" },
  { name: "Stay", artist: "The Kid LAROI", category: "Moderate", language: "English" },
  { name: "Kesariya", artist: "Arijit Singh", category: "Relaxed", language: "Hindi" },
  { name: "Raataan Lambiyan", artist: "Tanishk Bagchi", category: "Calm", language: "Hindi" },
  { name: "Mann Meri Jaan", artist: "King", category: "Upbeat", language: "Hindi" },
  { name: "Apna Bana Le", artist: "Arijit Singh", category: "Relaxed", language: "Hindi" },
  { name: "Baarish Ban Jaana", artist: "Stebin Ben", category: "Calm", language: "Hindi" }
];

export default function SeedSongs() {
  useEffect(() => {
    addSongsListToDatabase(SONGS)
      .then((res) => {
        console.log("Seeding complete!", res);
        alert("Seeding complete!");
      })
      .catch(err => {
        console.error("Seeding failed!", err);
        alert("Seeding failed, see console.");
      });
  }, []);
  return <div>Seeding songs... Check your console for the result.</div>;
}
