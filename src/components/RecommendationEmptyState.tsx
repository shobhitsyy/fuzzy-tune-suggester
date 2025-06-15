
import React from "react";
import { Button } from "@/components/ui/button";

interface RecommendationEmptyStateProps {
  includeEnglish: boolean;
  includeHindi: boolean;
  onBack: () => void;
}

const RecommendationEmptyState: React.FC<RecommendationEmptyStateProps> = ({
  includeEnglish,
  includeHindi,
  onBack,
}) => (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">
      {!includeEnglish && !includeHindi 
        ? "Please select at least one language to see recommendations."
        : "No songs found for your current mood. Try adjusting your preferences!"
      }
    </p>
    <Button 
      onClick={onBack}
      className="mt-4"
    >
      Adjust Settings
    </Button>
  </div>
);

export default RecommendationEmptyState;
