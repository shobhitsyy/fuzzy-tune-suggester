
import { useEffect } from "react";
import { addSongsListToDatabase } from "@/services/spotifyDatabaseService";
import { supabase } from "@/integrations/supabase/client";

const SONGS = [
  { name: "Channa Mereya", artist: "Arijit Singh", category: "Moderate", language: "Hindi" },
  { name: "Tum Se Hi", artist: "Mohit Chauhan", category: "Relaxed", language: "Hindi" },
  { name: "Weightless", artist: "Marconi Union", category: "Calm", language: "English" },
  { name: "Jeena Jeena", artist: "Atif Aslam", category: "Relaxed", language: "Hindi" },
  { name: "Fix You", artist: "Coldplay", category: "Calm", language: "English" },
  { name: "Tera Ban Jaunga", artist: "Akhil Sachdeva", category: "Moderate", language: "Hindi" },
  { name: "Let Her Go", artist: "Passenger", category: "Calm", language: "English" },
  { name: "Shayad", artist: "Arijit Singh", category: "Calm", language: "Hindi" },
  { name: "Tera Yaar Hoon Main", artist: "Arijit Singh", category: "Relaxed", language: "Hindi" },
  { name: "Pashmina", artist: "Amit Trivedi", category: "Upbeat", language: "Hindi" },
  { name: "Gymnopédie No.1", artist: "Erik Satie", category: "Calm", language: "English" },
  { name: "Counting Stars", artist: "OneRepublic", category: "Upbeat", language: "English" },
  { name: "Skinny Love", artist: "Bon Iver", category: "Calm", language: "English" },
  { name: "The Blower's Daughter", artist: "Damien Rice", category: "Calm", language: "English" },
  { name: "Main Rahoon Ya Na Rahoon", artist: "Armaan Malik", category: "Relaxed", language: "Hindi" },
  { name: "Breathe", artist: "Télépopmusik", category: "Calm", language: "English" },
  { name: "Photograph", artist: "Ed Sheeran", category: "Calm", language: "English" },
  { name: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar Rathod", category: "Moderate", language: "Hindi" },
  { name: "Perfect", artist: "Ed Sheeran", category: "Relaxed", language: "English" },
  { name: "Jab Tak", artist: "Armaan Malik", category: "Relaxed", language: "Hindi" },
  { name: "Let It Go", artist: "Idina Menzel", category: "Upbeat", language: "English" },
  { name: "Kaun Tujhe", artist: "Palak Muchhal", category: "Calm", language: "Hindi" },
  { name: "Stay With Me", artist: "Sam Smith", category: "Calm", language: "English" },
  { name: "Pee Loon", artist: "Mohit Chauhan", category: "Moderate", language: "Hindi" },
  { name: "All of Me", artist: "John Legend", category: "Relaxed", language: "English" },
  { name: "Raabta", artist: "Arijit Singh", category: "Moderate", language: "Hindi" },
  { name: "Talking to the Moon", artist: "Bruno Mars", category: "Calm", language: "English" },
  { name: "Hasi", artist: "Ami Mishra", category: "Relaxed", language: "Hindi" },
  { name: "Chale Aana", artist: "Armaan Malik", category: "Relaxed", language: "Hindi" }
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

async function getExistingSongsMap() {
  const { data, error } = await supabase
    .from("songs")
    .select("title,artist");
  if (error) {
    console.error("Error fetching existing songs:", error);
    return new Set();
  }
  // Create a set of 'normalizedTitle|normalizedArtist'
  return new Set(
    (data || []).map(song =>
      `${normalize(song.title)}|${normalize(song.artist)}`
    )
  );
}

export default function SeedSongs() {
  useEffect(() => {
    async function seed() {
      const existingSongsMap = await getExistingSongsMap();
      const newSongs = SONGS.filter(song => {
        const key = `${normalize(song.name)}|${normalize(song.artist)}`;
        return !existingSongsMap.has(key);
      });
      if (newSongs.length === 0) {
        alert("All songs already exist in the database!");
        return;
      }
      addSongsListToDatabase(newSongs)
        .then((res) => {
          console.log("Seeding complete!", res);
          alert(`Seeding complete! ${newSongs.length} new song(s) added.`);
        })
        .catch(err => {
          console.error("Seeding failed!", err);
          alert("Seeding failed, see console.");
        });
    }
    seed();
  }, []);
  return <div>Seeding songs... Check your console for the result.</div>;
}
