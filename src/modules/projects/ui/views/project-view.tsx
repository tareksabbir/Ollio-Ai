"use client";
interface Props {
  projectId: string;
}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageContainer from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/browser";
import ProjectHeader from "../components/project-header";

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
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
          TODO
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
