
import React from "react";

/**
 * Shows a lyric snippet for the song.
 * Props:
 *   - lyricSnippet: string | null
 */
interface LyricSnippetProps {
  lyricSnippet: string | null | undefined;
}

const LyricSnippet: React.FC<LyricSnippetProps> = ({ lyricSnippet }) => {
  if (!lyricSnippet || lyricSnippet.trim().length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">
        (No lyric snippet.)
      </span>
    );
  }
  return (
    <span className="text-xs text-gray-700 italic block px-1 pt-0.5">
      “{lyricSnippet}”
    </span>
  );
};

export default LyricSnippet;
