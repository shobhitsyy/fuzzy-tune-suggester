
export function getSongDbDataFromSpotifyTrack(song: any, spotifyTrack: any) {
  const minutes = Math.floor((spotifyTrack.duration_ms || 180000) / 60000);
  const seconds = Math.floor(((spotifyTrack.duration_ms || 180000) % 60000) / 1000);
  const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const album = spotifyTrack.album?.name || "Unknown Album";
  const releaseDate = (spotifyTrack.album as any)?.release_date || "2023-01-01";
  const artist = spotifyTrack.artists?.[0]?.name || song.artist;
  const coverImage = spotifyTrack.album?.images?.[0]?.url || "/placeholder.svg";
  const spotifyUrl = spotifyTrack.external_urls?.spotify || null;

  return {
    dbSong: {
      title: spotifyTrack.name,
      artist,
      album,
      release_date: releaseDate,
      language: song.language,
      category: song.category,
      cover_image: coverImage,
      duration,
      spotify_url: spotifyUrl,
      tags: [song.category],
      description: `${spotifyTrack.name} by ${artist}`,
    },
    lookupTitle: spotifyTrack.name,
    lookupArtist: artist,
  };
}
