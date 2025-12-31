import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/browser";
import { ExternalLinkIcon, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  data: Fragment;
  sandboxId: string | null;
  onRefresh: () => void;
  onPing: (sandboxId: string) => void;
}

const FragmentWeb = ({ data, sandboxId, onRefresh, onPing }: Props) => {
  const [fragmentKey, setFagmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // ✅ 30 সেকেন্ডের জন্য বাটন ডিজেবল রাখার স্টেট
  const [isCooldown, setIsCooldown] = useState(false);

  // ✅ Cooldown ট্রিগার করার ফাংশন
  const triggerCooldown = () => {
    setIsCooldown(true);
    // ৩০ সেকেন্ড পর আবার এনেবল করবে
    setTimeout(() => {
      setIsCooldown(false);
    }, 30000);
  };

  const handleRefresh = () => {
    setFagmentKey((prev) => prev + 1);
    triggerCooldown(); // ✅ Refresh কল করলে কুলডাউন চালু হবে
    if (onRefresh) onRefresh();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    triggerCooldown(); 
  };

  const handleOpenNewTab = () => {
    if (!data.sandboxUrl) return;
    window.open(data.sandboxUrl, "_blank");
    triggerCooldown();
  };

  // Keep Alive Logic (আগের মতোই)
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
        <Hint text="Refresh Sandbox" side="bottom" align="start">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isCooldown} // ✅ কুলডাউনে থাকলে ডিজেবল
          >
            <RefreshCcw />
          </Button>
        </Hint>
        
        <Hint text="Click to copy" side="bottom">
          <Button
            className="flex-1 justify-start text-start font-normal"
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied || isCooldown} // ✅ কুলডাউনে থাকলে ডিজেবল
            onClick={handleCopy}
          >
            <span className="truncate">
              {isCooldown ? "Please wait..." : (copied ? "Copied!" : data.sandboxUrl)}
            </span>
          </Button>
        </Hint>
        
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            disabled={!data.sandboxUrl || isCooldown} // ✅ কুলডাউনে থাকলে ডিজেবল
            size="sm"
            variant="outline"
            onClick={handleOpenNewTab}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        loading="lazy"
        src={data.sandboxUrl}
      ></iframe>
    </section>
  );
};

export default FragmentWeb;