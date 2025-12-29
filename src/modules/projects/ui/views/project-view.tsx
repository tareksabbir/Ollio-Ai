"use client";

import FileExplorer from "@/components/file-explorer";
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

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  
  const trpc = useTRPC();

  // ✅ Fragment update mutation
  const updateFragment = useMutation(
    trpc.fragments.update.mutationOptions({
      onSuccess: () => {
        toast.success("Files saved successfully!");
      },
      onError: (error) => {
        toast.error("Failed to save files: " + error.message);
      },
    })
  );

  // ✅ onSave handler
  const handleSaveFiles = async (fragmentId: string, files: Record<string, string>) => {
    await updateFragment.mutateAsync({
      fragmentId,
      files,
    });
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <MessageContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          <Tabs
            value={tabState}
            className="h-full gap-y-0"
            defaultValue="preview"
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
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
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                  fragmentId={activeFragment.id} // ✅ fragmentId pass korchi
                  onSave={handleSaveFiles} // ✅ onSave handler pass korchi
                  allowEdit={true}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
// "use client";
// interface Props {
//   projectId: string;
// }
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
// import FileExplorer from "@/components/file-explorer";

// const ProjectView = ({ projectId }: Props) => {
//   const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
//   const [tabState, setTabState] = useState<"preview" | "code">("preview");

//   return (
//     <div className="h-screen">
//       <ResizablePanelGroup direction="horizontal">
//         <ResizablePanel
//           defaultSize={25}
//           minSize={20}
//           className="flex flex-col min-h-0"
//         >
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProjectHeader projectId={projectId} />
//           </Suspense>
//           <Suspense fallback={<div>Loading...</div>}>
//             <MessageContainer
//               projectId={projectId}
//               activeFragment={activeFragment}
//               setActiveFragment={setActiveFragment}
//             />
//           </Suspense>
//         </ResizablePanel>
//         <ResizableHandle withHandle />
//         <ResizablePanel
//           defaultSize={75}
//           minSize={50}
//           className="flex flex-col min-h-0"
//         >
//           <Tabs
//             value={tabState}
//             className="h-full gap-y-0"
//             defaultValue="preview"
//             onValueChange={(value) => setTabState(value as "preview" | "code")}
//           >
//             <div className="w-full flex items-center p-2 border-b gap-x-2">
//               <TabsList className="h-8 p-0 border rounded-md">
//                 <TabsTrigger value="preview" className="rounded-md">
//                   <EyeIcon /> <span>Demo</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="code" className="rounded-md">
//                   <CodeIcon /> <span>Code</span>
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
//               {!!activeFragment && <FragmentWeb data={activeFragment} />}
//             </TabsContent>
//             <TabsContent value="code" className="min-h-0">
//               {!!activeFragment?.files && (
//                 <FileExplorer
//                   files={activeFragment.files as { [path: string]: string }}
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
