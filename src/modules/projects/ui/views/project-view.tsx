"use client";

// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  projectId: string;
}

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageContainer from "../components/messages-container";
import { Suspense } from "react";

const ProjectView = ({ projectId }: Props) => {
//   const trpc = useTRPC();

//   const { data: project } = useSuspenseQuery(
//     trpc.projects.getOne.queryOptions({
//       id: projectId,
//     })
//   );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <MessageContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          TODO
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
