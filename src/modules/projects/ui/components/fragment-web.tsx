import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/browser";
import { ExternalLinkIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Fragment;
}

const FragmentWeb = ({ data }: Props) => {
  const [fragmentKey, setFagmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const onRefresh = () => {
    setFagmentKey((prev) => prev + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
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
