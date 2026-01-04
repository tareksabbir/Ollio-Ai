// app/error.tsx
"use client";

import { useEffect } from "react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Application Error
              </h1>
              <p className="text-muted-foreground">
                Something went wrong. The application encountered an unexpected
                error.
              </p>
            </div>

            <details className="rounded-lg border border-border bg-card p-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-card-foreground hover:text-foreground transition-colors">
                Error Details
              </summary>
              <div className="mt-3 space-y-2">
                <pre className="overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground whitespace-pre-wrap wrap-break-word">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-muted-foreground">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </details>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
