
import React, { useEffect, useState } from "react";
import { getLyricSnippet } from "@/api/getLyricSnippet";

interface LyricSnippetProps {
  title: string;
  artist: string;
}

const LyricSnippet: React.FC<LyricSnippetProps> = ({ title, artist }) => {
  const [snippet, setSnippet] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setSnippet(null);
    getLyricSnippet(title, artist).then((res) => {
      if (mounted) setSnippet(res);
    });
    return () => {
      mounted = false;
    }
  }, [title, artist]);

  if (snippet === null)
    return (
      <span className="text-xs text-gray-400 italic animate-pulse">
        fetching famous line...
      </span>
    );

  return snippet ? (
    <span className="text-xs text-gray-700 italic truncate block px-1 pt-0.5">
      “{snippet}”
    </span>
  ) : (
    <span className="text-xs text-gray-400 italic">
      (No lyric found)
    </span>
  );
};

export default LyricSnippet;
