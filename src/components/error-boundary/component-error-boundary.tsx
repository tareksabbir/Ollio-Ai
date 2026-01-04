/* eslint-disable @typescript-eslint/no-unused-vars */
// components/error-boundary/component-error-boundary.tsx
'use client';

import { ErrorBoundary, ErrorBoundaryPropsWithRender } from 'react-error-boundary';
import { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

function ComponentErrorFallback({ 
  error, 
  resetErrorBoundary,
  componentName 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
  componentName?: string;
}) {
  return (
    <div className="flex items-center justify-center p-6 rounded-lg border border-destructive/20 bg-destructive/5">
      <div className="max-w-md space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-destructive">
              Component Error
              {componentName && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({componentName})
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              This section encountered an error and couldnt be displayed.
            </p>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground transition-colors">
                View error details
              </summary>
              <pre className="mt-2 p-2 rounded bg-muted overflow-x-auto whitespace-pre-wrap wrap-break-word">
                {error.message}
              </pre>
            </details>
          </div>
        </div>
        <Button
          onClick={resetErrorBoundary}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </Button>
      </div>
    </div>
  );
}

export function ComponentErrorBoundary({ 
  children, 
  fallback,
  onError,
  componentName
}: Props) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => 
        fallback || <ComponentErrorFallback {...props} componentName={componentName} />
      }
      onError={(error, errorInfo) => {
        console.error('Component error:', {
          componentName,
          error,
          errorInfo
        });
        onError?.(error, errorInfo);
      }}
      onReset={() => {
        // Optional: Reset component state
        console.log('Error boundary reset');
      }}
    >
      {children}
    </ErrorBoundary>
  );
}