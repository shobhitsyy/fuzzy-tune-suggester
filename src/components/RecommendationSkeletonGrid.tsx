
import React from "react";

const RecommendationSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="aspect-square bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

export default RecommendationSkeletonGrid;
