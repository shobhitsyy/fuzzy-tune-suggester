
export async function getLyricSnippet(title: string, artist: string): Promise<string> {
  try {
    const resp = await fetch("/functions/v1/get-lyric-snippet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist }),
    });
    const data = await resp.json();
    if (data.snippet) return data.snippet;
    return "";
  } catch {
    return "";
  }
}
