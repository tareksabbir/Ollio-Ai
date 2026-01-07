import React from 'react';

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-56 bg-muted"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Category Skeleton */}
        <div className="h-3 w-20 bg-muted rounded"></div>
        
        {/* Title Skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded"></div>
      </div>
    </div>
  );
};

// Grid Layout যেখানে Skeleton দেখানো হবে
export const ProjectsSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};