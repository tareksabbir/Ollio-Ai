// modules/projects/ui/views/project-view.tsx
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

import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/browser";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../../../fragments/ui/components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectHeaderSkeleton from "../../../../components/skeletons/project-header-skeleton";
import MessageContainerSkeleton from "../../../../components/skeletons/message-container-skeleton";
import CodeLoadingSkeleton from "../../../../components/skeletons/code-loading-skeleton";
import PreviewLoadingSkeleton from "../../../../components/skeletons/preview-loading-skeleton";
import UserControl from "@/components/clerk/user-controler";
import { useTheme } from "next-themes";
import MessageContainer from "@/modules/messages/ui/components/messages-container";
import { ComponentErrorBoundary } from "@/components/error-boundary/component-error-boundary";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("code");
  const [currentSandboxId, setCurrentSandboxId] = useState<string | null>(null);

  const trpc = useTRPC();
  const { theme, setTheme } = useTheme();

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
      onSuccess: (updatedFragment, variables) => {
        toast.success("Files saved successfully!");
        setActiveFragment((prev) => {
          if (prev && prev.id === variables.fragmentId) {
            return {
              ...prev,
              files: variables.files,
            };
          }
          return prev;
        });
      },
      onError: (error) => {
        toast.error("Failed to save files: " + error.message);
      },
    })
  );

  const handleSaveFiles = async (
    fragmentId: string,
    files: Record<string, string>
  ) => {
    if (activeFragment?.id !== fragmentId) {
      toast.error("Fragment mismatch error");
      console.error("Attempting to save wrong fragment", {
        activeFragmentId: activeFragment?.id,
        saveFragmentId: fragmentId,
      });
      return;
    }

    try {
      await updateFragment.mutateAsync({ fragmentId, files });
    } catch (error) {
      console.error("Save failed:", error);
    }
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
    if (
      activeFragment &&
      fragment &&
      activeFragment.id !== fragment.id &&
      updateFragment.isPending
    ) {
      console.warn("Switching fragments while save is in progress");
    }

    setActiveFragment(fragment);
    setCurrentSandboxId(null);
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel with Error Boundary */}
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ComponentErrorBoundary componentName="ProjectHeader">
            <Suspense fallback={<ProjectHeaderSkeleton />}>
              <ProjectHeader title={activeFragment?.title ?? "Untitled"} />
            </Suspense>
          </ComponentErrorBoundary>

          <ComponentErrorBoundary componentName="MessageContainer">
            <Suspense fallback={<MessageContainerSkeleton />}>
              <MessageContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={handleFragmentChange}
              />
            </Suspense>
          </ComponentErrorBoundary>
        </ResizablePanel>

        <ResizableHandle withHandle className="z-50" />

        {/* Right Panel with Error Boundaries */}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <UserControl />
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
              <ComponentErrorBoundary componentName="FragmentPreview">
                {!activeFragment ? (
                  <PreviewLoadingSkeleton />
                ) : (
                  <FragmentWeb
                    data={activeFragment}
                    sandboxId={currentSandboxId}
                    onReset={() => restoreSandbox(activeFragment)}
                    onPing={handlePing}
                  />
                )}
              </ComponentErrorBoundary>
            </TabsContent>

            <TabsContent value="code" className="h-full min-h-0 bg-background">
              <ComponentErrorBoundary componentName="FileExplorer">
                {!activeFragment ? (
                  <CodeLoadingSkeleton />
                ) : (
                  !!activeFragment?.files && (
                    <FileExplorer
                      key={activeFragment.id}
                      files={activeFragment.files as { [path: string]: string }}
                      fragmentId={activeFragment.id}
                      onSave={handleSaveFiles}
                      allowEdit={true}
                    />
                  )
                )}
              </ComponentErrorBoundary>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;