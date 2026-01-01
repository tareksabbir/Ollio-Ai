// import Hint from "@/components/hint";
// import { Button } from "@/components/ui/button";
// import { Fragment } from "@/generated/prisma/browser";
// import { ExternalLinkIcon, RotateCcw, RefreshCcw } from "lucide-react";
// import { useState, useEffect } from "react";

// interface Props {
//   data: Fragment;
//   sandboxId: string | null;
//   onRefresh: () => void; // এটি New Sandbox তৈরির জন্য
//   onPing: (sandboxId: string) => void;
// }

// const FragmentWeb = ({ data, sandboxId, onRefresh, onPing }: Props) => {
//   const [fragmentKey, setFagmentKey] = useState(0);
//   const [copied, setCopied] = useState(false);

//   // ✅ ৩০ সেকেন্ডের জন্য বাটন ডিজেবল রাখার স্টেট (শুধুমাত্র New Sandbox এর জন্য)
//   const [isCooldown, setIsCooldown] = useState(false);

//   // ✅ Cooldown ট্রিগার করার ফাংশন
//   const triggerCooldown = () => {
//     setIsCooldown(true);
//     setTimeout(() => {
//       setIsCooldown(false);
//     }, 30000);
//   };

//   // ✅ নতুন স্যান্ডবক্স তৈরির ফাংশন (Reset)
//   const handleNewSandbox = () => {
//     setFagmentKey((prev) => prev + 1); // আইফ্রেম ফোর্স রিলোড
//     triggerCooldown(); // কুলডাউন চালু করুন
//     if (onRefresh) onRefresh(); // ব্যাকেন্ডে রিকোয়েস্ট পাঠান
//   };

//   // ✅ নরমাল পেজ রিফ্রেশ ফাংশন
//   const handlePageRefresh = () => {
//     window.location.reload(); // সাধারণ পেজ রিফ্রেশ
//   };

//   const handleCopy = () => {
//     if (!data.sandboxUrl) return;
//     navigator.clipboard.writeText(data.sandboxUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//     triggerCooldown();
//   };

//   const handleOpenNewTab = () => {
//     if (!data.sandboxUrl) return;
//     window.open(data.sandboxUrl, "_blank");
//     triggerCooldown();
//   };

//   // Keep Alive Logic (আগের মতোই)
//   useEffect(() => {
//     if (!sandboxId || !data.sandboxUrl) return;

//     const interval = setInterval(() => {
//       onPing(sandboxId);
//       console.log("Ping sent to keep sandbox alive");
//     }, 40000);

//     return () => clearInterval(interval);
//   }, [sandboxId, data.sandboxUrl, onPing]);

//   return (
//     <section className="flex flex-col w-full h-full">
//       <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
//         {/* ✅ ২. Normal Refresh (Page Reload) বাটন */}
//         <Hint text="Refresh Page" side="bottom" align="start">
//           <Button size="sm" variant="outline" onClick={handlePageRefresh}>
//             <RefreshCcw />
//           </Button>
//         </Hint>

//         <Hint text="Click to copy" side="bottom">
//           <Button
//             className="flex-1 justify-start text-start font-normal"
//             size="sm"
//             variant="outline"
//             disabled={!data.sandboxUrl || copied || isCooldown}
//             onClick={handleCopy}
//           >
//             <span className="truncate">
//               {isCooldown
//                 ? "Please wait..."
//                 : copied
//                 ? "Copied!"
//                 : data.sandboxUrl}
//             </span>
//           </Button>
//         </Hint>

//         {/* ✅ ১. New Sandbox (Reset) বাটন */}
//         <Hint text="Reset / Create New Sandbox" side="bottom" align="start">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={handleNewSandbox}
//             disabled={isCooldown}
//           >
//             <RotateCcw /> Reset Sandbox
//           </Button>
//         </Hint>
//         <Hint text="Open in a new tab" side="bottom" align="start">
//           <Button
//             disabled={!data.sandboxUrl || isCooldown}
//             size="sm"
//             variant="outline"
//             onClick={handleOpenNewTab}
//           >
//             <ExternalLinkIcon />
//           </Button>
//         </Hint>
//       </div>

//       <iframe
//         key={fragmentKey}
//         className="h-full w-full"
//         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//         loading="lazy"
//         src={data.sandboxUrl ?? ""}
//       ></iframe>
//     </section>
//   );
// };

// export default FragmentWeb;

"use client";

import Hint from "@/components/hint";
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
            /> Reset Sandbox
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
