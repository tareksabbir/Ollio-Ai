"use client";


import Hint from "@/components/custom/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/browser";
import { ExternalLinkIcon, RefreshCcw, RotateCcw } from "lucide-react"; // ✅ RotateCcw added
import { useState, useEffect } from "react";

interface Props {
  data: Fragment;
  sandboxId: string | null;
  onReset: () => void; // ✅ Renamed from onRefresh to onReset
  onPing: (sandboxId: string) => void;
}

const FragmentWeb = ({ data, sandboxId, onReset, onPing }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // ✅ Cooldown শুধুমাত্র Reset (New Sandbox) এর জন্য
  const [isCooldown, setIsCooldown] = useState(false);

  const triggerCooldown = () => {
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 30000);
  };

  // ✅ Refresh: শুধু Iframe রিলোড করবে (URL একই থাকবে)
  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  // ✅ Reset: নতুন Sandbox তৈরি করবে
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

  // Keep Alive Logic
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
        {/* ✅ Refresh Button (URL Reload) */}
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
        {/* ✅ Reset Button (New Sandbox) */}
        <Hint text="Reset / Create New Sandbox" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isCooldown}
          >
            <RotateCcw
              className={`h-4 w-4 ${isCooldown ? "animate-spin" : ""}`}
            />Restart 
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

      {/* Iframe key change triggers reload */}
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        loading="lazy"
        src={data.sandboxUrl ?? ""}
      ></iframe>
    </section>
  );
};

export default FragmentWeb;
