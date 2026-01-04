// app/projects/[projectId]/loading.tsx
import { Code2, Loader2, MessageSquare } from 'lucide-react';

export default function ProjectLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        {/* Main loading indicator */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            
            {/* Spinning loader */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-muted">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Loading Project
            </h3>
            <p className="text-sm text-muted-foreground">
              Preparing your workspace...
            </p>
          </div>
        </div>

        {/* Loading steps indicators */}
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <LoadingStep
            icon={<MessageSquare className="h-4 w-4" />}
            text="Loading messages"
            delay="0ms"
          />
          <LoadingStep
            icon={<Code2 className="h-4 w-4" />}
            text="Preparing code editor"
            delay="150ms"
          />
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ 
  icon, 
  text, 
  delay 
}: { 
  icon: React.ReactNode; 
  text: string; 
  delay: string;
}) {
  return (
    <div 
      className="flex items-center gap-3 animate-pulse"
      style={{ animationDelay: delay }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
      <div className="ml-auto flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-ping" style={{ animationDelay: delay }} />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-ping" style={{ animationDelay: `calc(${delay} + 100ms)` }} />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/20 animate-ping" style={{ animationDelay: `calc(${delay} + 200ms)` }} />
      </div>
    </div>
  );
}