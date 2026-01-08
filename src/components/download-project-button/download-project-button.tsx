"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Hint from "../custom/hint";

interface Props {
  fragmentId: string;
  title: string;
}

export function DownloadProjectButton({ fragmentId, title }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    toast.loading("Preparing download...", { id: "dl" });

    try {
      const response = await fetch("/api/sandbox/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fragmentId }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Download failed");
      }

      // Directly get blob from response (No Base64 conversion needed)
      const blob = await response.blob();

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-")}-source.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download started!", { id: "dl" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download project", { id: "dl" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      size="sm"
      variant="outline"
      className="h-8"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Hint text="Download Source" side="top">
          <Download className="h-4 w-4" />
        </Hint>
      )}
    </Button>
  );
}
