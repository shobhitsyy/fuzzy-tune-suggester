
export function getSongDbDataFromSpotifyTrack(song: any, spotifyTrack: any) {
  const minutes = Math.floor((spotifyTrack.duration_ms || 180000) / 60000);
  const seconds = Math.floor(((spotifyTrack.duration_ms || 180000) % 60000) / 1000);
  const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const album = spotifyTrack.album?.name || "Unknown Album";
  const releaseDate = (spotifyTrack.album as any)?.release_date || "2023-01-01";
  const artist = spotifyTrack.artists?.[0]?.name || song.artist;
  const coverImage = spotifyTrack.album?.images?.[0]?.url || "/placeholder.svg";
  const spotifyUrl = spotifyTrack.external_urls?.spotify || null;

  // Generate a more rich description for recommendations & display
  // Uses: title, artist, album, category, year, language
  let year = "";
  if (releaseDate && /^\d{4}/.test(releaseDate)) {
    year = releaseDate.slice(0, 4);
  }

  // Enhance description depending on information present
  const descriptionOptions: string[] = [
    `${spotifyTrack.name} is a ${song.category?.toLowerCase()} ${song.language?.toLowerCase()} song by ${artist}${year ? `, released in ${year}` : ""}.`,
    `Enjoy the vibes of "${spotifyTrack.name}" by ${artist}, from the album "${album}"${year ? ` (${year})` : ""}.`,
    `"${spotifyTrack.name}" is part of your ${song.category?.toLowerCase()} collection, performed by ${artist}${year ? ` (${year})` : ""}.`,
    `Let "${spotifyTrack.name}" by ${artist} from "${album}" redefine your ${song.category?.toLowerCase()} mood.`,
  ];
  // Pick one randomly for more varied UI (description is stored, not random per render)
  const randomDesc =
    descriptionOptions[
      Math.floor(
        Math.abs([...spotifyTrack.name].reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
          descriptionOptions.length
      )
    ];

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
      description: randomDesc,
    },
    lookupTitle: spotifyTrack.name,
    lookupArtist: artist,
  };
}

