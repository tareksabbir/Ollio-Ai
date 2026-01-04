// modules/fragments/ui/components/fragment-web.tsx
"use client";

import Hint from "@/components/custom/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/browser";
import { ExternalLinkIcon, RefreshCcw, RotateCcw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { ComponentErrorBoundary } from "@/components/error-boundary/component-error-boundary";

interface Props {
  data: Fragment;
  sandboxId: string | null;
  onReset: () => void;
  onPing: (sandboxId: string) => void;
}

// Separate iframe component for better error isolation
function SandboxIframe({ 
  url, 
  fragmentKey 
}: { 
  url: string; 
  fragmentKey: number 
}) {
  return (
    <iframe
      key={fragmentKey}
      className="h-full w-full"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      loading="lazy"
      src={url}
      title="Preview"
    />
  );
}

// Custom fallback for iframe errors
function IframeErrorFallback({ 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center bg-muted/20">
      <div className="max-w-md space-y-4 p-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-destructive">Preview Error</h3>
          <p className="text-sm text-muted-foreground">
            Unable to load the preview. The sandbox may have crashed or the URL is invalid.
          </p>
        </div>
        <Button onClick={resetErrorBoundary} size="sm" variant="outline">
          <RefreshCcw className="h-3.5 w-3.5 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}

const FragmentWeb = ({ data, sandboxId, onReset, onPing }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const triggerCooldown = () => {
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 30000);
  };

  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleReset = () => {
    if (onReset) onReset();
    triggerCooldown();
  };

  const handleCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNewTab = () => {
    if (!data.sandboxUrl) return;
    window.open(data.sandboxUrl, "_blank");
  };

  useEffect(() => {
    if (!sandboxId || !data.sandboxUrl) return;

    const interval = setInterval(() => {
      onPing(sandboxId);
      console.log("Ping sent to keep sandbox alive");
    }, 40000);

    return () => clearInterval(interval);
  }, [sandboxId, data.sandboxUrl, onPing]);

  return (
    <section className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Reload Preview" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </Hint>

        <div className="w-px h-6 bg-border mx-1"></div>

        <Hint text="Click to copy" side="bottom">
          <Button
            className="flex-1 justify-start text-start font-normal"
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied || isCooldown}
            onClick={handleCopy}
          >
            <span className="truncate text-xs">
              {isCooldown
                ? "Wait for sandbox..."
                : copied
                ? "Copied!"
                : data.sandboxUrl}
            </span>
          </Button>
        </Hint>

        <Hint text="Reset / Create New Sandbox" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isCooldown}
          >
            <RotateCcw
              className={`h-4 w-4 ${isCooldown ? "animate-spin" : ""}`}
            />
            Restart
          </Button>
        </Hint>

        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            disabled={!data.sandboxUrl || isCooldown}
            size="sm"
            variant="outline"
            onClick={handleOpenNewTab}
          >
            <ExternalLinkIcon className="h-4 w-4" /> View
          </Button>
        </Hint>
      </div>

      {/* Iframe with error boundary */}
      <ComponentErrorBoundary 
        componentName="SandboxIframe"
        fallback={<IframeErrorFallback error={new Error("Iframe failed to load")} resetErrorBoundary={handleRefresh} />}
      >
        {data.sandboxUrl ? (
          <SandboxIframe url={data.sandboxUrl} fragmentKey={fragmentKey} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>No preview available</p>
          </div>
        )}
      </ComponentErrorBoundary>
    </section>
  );
};

export default FragmentWeb;