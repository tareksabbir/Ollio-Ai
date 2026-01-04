// app/projects/[projectId]/error.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Project error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-start gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <div className="shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-destructive">
                Project Loading Error
              </h2>
              <p className="text-sm text-muted-foreground">
                Unable to load the project. This could be due to network issues, 
                invalid project ID, or permission problems.
              </p>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-foreground hover:text-destructive transition-colors">
                Technical Details
              </summary>
              <div className="mt-2 space-y-2">
                <pre className="overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground whitespace-pre-wrap wrap-break-word">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-muted-foreground">
                    Error Reference: {error.digest}
                  </p>
                )}
              </div>
            </details>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={reset}
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </Button>
              <Button
                onClick={() => router.push('/projects')}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Projects</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-medium text-card-foreground">
            Common Solutions
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Check your internet connection and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Verify you have access to this project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Try refreshing the page or clearing browser cache</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}