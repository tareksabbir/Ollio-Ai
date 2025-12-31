// "use client";

// import FileExplorer from "@/components/code-view/file-explorer";
// import { useTRPC } from "@/trpc/client";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import MessageContainer from "../components/messages-container";
// import { Suspense, useState } from "react";
// import { Fragment } from "@/generated/prisma/browser";
// import ProjectHeader from "../components/project-header";
// import FragmentWeb from "../components/fragment-web";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// interface Props {
//   projectId: string;
// }

// const ProjectView = ({ projectId }: Props) => {
//   const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
//   const [tabState, setTabState] = useState<"preview" | "code">("code");
//   const [currentSandboxId, setCurrentSandboxId] = useState<string | null>(null);

//   const trpc = useTRPC();

//   // ✅ tRPC Mutation: Restore (mutationOptions প্যাটার্ন ব্যবহার করা হলো)
//   const restoreMutation = useMutation(
//     trpc.sandbox.restore.mutationOptions({
//       onSuccess: (data: { url: string; sandboxId: string }) => { // ✅ Explicitly type 'data'
//         if (activeFragment) {
//           setActiveFragment((prev) =>
//             prev ? { ...prev, sandboxUrl: data.url } : null
//           );
//           setCurrentSandboxId(data.sandboxId);
//           toast.success("Preview restored successfully!");
//         }
//       },
//       onError: (err) => {
//         toast.error("Failed to restore preview: " + err.message);
//       }
//     })
//   );

//   // ✅ tRPC Mutation: Ping (mutationOptions প্যাটার্ন ব্যবহার করা হলো)
//   const pingMutation = useMutation(
//     trpc.sandbox.ping.mutationOptions()
//   );

//   // ✅ tRPC Mutation: Update Fragment (আগের মতোই)
//   const updateFragment = useMutation(
//     trpc.fragments.update.mutationOptions({
//       onSuccess: () => toast.success("Files saved successfully!"),
//       onError: (error) => toast.error("Failed to save files: " + error.message),
//     })
//   );

//   const handleSaveFiles = async (fragmentId: string, files: Record<string, string>) => {
//     await updateFragment.mutateAsync({ fragmentId, files });
//   };

//   // Restore Handler
//   const restoreSandbox = async (fragment: Fragment) => {
//     toast.loading("Restoring sandbox...", { id: "restore" });
//     await restoreMutation.mutateAsync({ fragmentId: fragment.id });
//     toast.dismiss("restore");
//   };

//   // Ping Handler (FragmentWeb এর জন্য)
//   const handlePing = (sandboxId: string) => {
//     pingMutation.mutate({ sandboxId });
//   };

//   const handleFragmentChange = (fragment: Fragment | null) => {
//     setActiveFragment(fragment);
//     setCurrentSandboxId(null);
//   };

//   return (
//     <div className="h-screen">
//       <ResizablePanelGroup direction="horizontal">
//         <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col min-h-0">
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProjectHeader projectId={projectId} />
//           </Suspense>
//           <Suspense fallback={<div>Loading...</div>}>
//             <MessageContainer
//               projectId={projectId}
//               activeFragment={activeFragment}
//               setActiveFragment={handleFragmentChange}
//             />
//           </Suspense>
//         </ResizablePanel>

//         <ResizableHandle withHandle className="z-50" />

//         <ResizablePanel defaultSize={75} minSize={50} className="flex flex-col min-h-0">
//           <Tabs
//             value={tabState}
//             className="h-full gap-y-0"
//             defaultValue="code"
//             onValueChange={(value) => setTabState(value as "preview" | "code")}
//           >
//             <div className="w-full flex items-center p-2 border-b gap-x-2">
//               <TabsList className="h-8 p-0 border rounded-md">
//                 <TabsTrigger value="code" className="rounded-md">
//                   <CodeIcon /> <span>Code</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="preview" className="rounded-md">
//                   <EyeIcon /> <span>Demo</span>
//                 </TabsTrigger>
//               </TabsList>
//               <div className="ml-auto flex items-center gap-x-2">
//                 <Button asChild size="sm">
//                   <Link href="/pricing">
//                     <CrownIcon /> Upgrade
//                   </Link>
//                 </Button>
//               </div>
//             </div>

//             <TabsContent value="preview">
//               {!!activeFragment && (
//                 <FragmentWeb
//                   data={activeFragment}
//                   sandboxId={currentSandboxId}
//                   onRefresh={() => restoreSandbox(activeFragment)}
//                   onPing={handlePing}
//                 />
//               )}
//             </TabsContent>

//             <TabsContent value="code" className="min-h-0">
//               {!!activeFragment?.files && (
//                 <FileExplorer
//                   files={activeFragment.files as { [path: string]: string }}
//                   fragmentId={activeFragment.id}
//                   onSave={handleSaveFiles}
//                   allowEdit={true}
//                 />
//               )}
//             </TabsContent>
//           </Tabs>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// };

// export default ProjectView;

"use client";

import FileExplorer from "@/components/code-view/file-explorer";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageContainer from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/browser";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectHeaderSkeleton from "../skeletons/project-header-skeleton";
import MessageContainerSkeleton from "../skeletons/message-container-skeleton";
import CodeLoadingSkeleton from "../skeletons/code-loading-skeleton";
import PreviewLoadingSkeleton from "../skeletons/preview-loading-skeleton";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("code");
  const [currentSandboxId, setCurrentSandboxId] = useState<string | null>(null);

  const trpc = useTRPC();

  // Mutations
  const restoreMutation = useMutation(
    trpc.sandbox.restore.mutationOptions({
      onSuccess: (data: { url: string; sandboxId: string }) => {
        if (activeFragment) {
          setActiveFragment((prev) =>
            prev ? { ...prev, sandboxUrl: data.url } : null
          );
          setCurrentSandboxId(data.sandboxId);
          toast.success("Preview restored successfully!");
        }
      },
      onError: (err) => {
        toast.error("Failed to restore preview: " + err.message);
      },
    })
  );

  const pingMutation = useMutation(trpc.sandbox.ping.mutationOptions());

  const updateFragment = useMutation(
    trpc.fragments.update.mutationOptions({
      onSuccess: () => toast.success("Files saved successfully!"),
      onError: (error) => toast.error("Failed to save files: " + error.message),
    })
  );

  const handleSaveFiles = async (
    fragmentId: string,
    files: Record<string, string>
  ) => {
    await updateFragment.mutateAsync({ fragmentId, files });
  };

  const restoreSandbox = async (fragment: Fragment) => {
    toast.loading("Restoring sandbox...", { id: "restore" });
    await restoreMutation.mutateAsync({ fragmentId: fragment.id });
    toast.dismiss("restore");
  };

  const handlePing = (sandboxId: string) => {
    pingMutation.mutate({ sandboxId });
  };

  const handleFragmentChange = (fragment: Fragment | null) => {
    setActiveFragment(fragment);
    setCurrentSandboxId(null);
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel */}
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          {/* ✅ Suspense with Skeleton for Header */}
          <Suspense fallback={<ProjectHeaderSkeleton />}>
            <ProjectHeader projectId={projectId} />
          </Suspense>

          {/* ✅ Suspense with Skeleton for Messages */}
          <Suspense fallback={<MessageContainerSkeleton />}>
            <MessageContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={handleFragmentChange}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle withHandle className="z-50" />

        {/* Right Panel */}
        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          <Tabs
            value={tabState}
            className="h-full gap-y-0"
            defaultValue="code"
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b border-border gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm">
                  <Link href="/pricing">
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>

            <TabsContent
              value="preview"
              className="h-full min-h-0 bg-background"
            >
              {!activeFragment ? (
                <PreviewLoadingSkeleton />
              ) : (
                <FragmentWeb
                  data={activeFragment}
                  sandboxId={currentSandboxId}
                  onRefresh={() => restoreSandbox(activeFragment)}
                  onPing={handlePing}
                />
              )}
            </TabsContent>

            <TabsContent value="code" className="h-full min-h-0 bg-background">
              {!activeFragment ? (
                <CodeLoadingSkeleton />
              ) : (
                !!activeFragment?.files && (
                  <FileExplorer
                    files={activeFragment.files as { [path: string]: string }}
                    fragmentId={activeFragment.id}
                    onSave={handleSaveFiles}
                    allowEdit={true}
                  />
                )
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
