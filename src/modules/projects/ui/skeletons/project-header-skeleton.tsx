const ProjectHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border animate-pulse">
      <div className="flex items-center gap-2">
        {/* Logo placeholder */}
        <div className="w-6 h-6 rounded bg-muted" />
        {/* Project name placeholder */}
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
      {/* Action icon placeholder */}
      <div className="h-6 w-6 rounded bg-muted" />
    </div>
  );
};

export default ProjectHeaderSkeleton;
