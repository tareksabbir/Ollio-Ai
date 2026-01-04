// app/loading.tsx
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated loader with glow effect */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          
          {/* Main spinner */}
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-foreground">Loading</p>
          <div className="flex gap-0.5">
            <span className="animate-bounce text-sm text-foreground" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce text-sm text-foreground" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce text-sm text-foreground" style={{ animationDelay: '300ms' }}>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}