import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/browser";
import { ExternalLinkIcon, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  data: Fragment;
  sandboxId: string | null;
  onRefresh: () => void;
  onPing: (sandboxId: string) => void; // ✅ নতুন Prop যোগ হলো
}

const FragmentWeb = ({ data, sandboxId, onRefresh, onPing }: Props) => {
  const [fragmentKey, setFagmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setFagmentKey((prev) => prev + 1);
    if (onRefresh) onRefresh();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Keep Alive Logic (tRPC ব্যবহার করে)
  useEffect(() => {
    if (!sandboxId || !data.sandboxUrl) return;

    const interval = setInterval(() => {
      // এখানে fetch না করে Parent থেকে আসা onPing ফাংশন কল করা হচ্ছে
      onPing(sandboxId);
      console.log("Ping sent to keep sandbox alive");
    }, 40000);

    return () => clearInterval(interval);
  }, [sandboxId, data.sandboxUrl, onPing]);

  return (
    <section className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh Sandbox" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCcw />
          </Button>
        </Hint>
        <Hint text="Click to copy" side="bottom">
          <Button
            className="flex-1 justify-start text-start font-normal"
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            disabled={!data.sandboxUrl}
            size="sm"
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
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