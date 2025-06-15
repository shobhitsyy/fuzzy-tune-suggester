
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SongCardTagsProps {
  tags?: string[];
}

const SongCardTags: React.FC<SongCardTagsProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center pt-0.5 sm:pt-1">
      {tags.slice(0, 2).map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs py-0 px-1 sm:px-1.5 h-4 sm:h-5 bg-gray-100 text-gray-600">
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default SongCardTags;
