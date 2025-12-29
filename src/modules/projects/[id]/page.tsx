"use client";

import FileExplorer from "@/components/file-explorer";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const trpc = useTRPC();

  const { data: messages, isLoading } = useQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );

  const updateFragment = useMutation(
    trpc.fragments.update.mutationOptions()
  );

  const latestFragmentMessage = messages?.find(
    (msg) => msg.fragment && msg.type === "RESULT"
  );

  const handleSaveFiles = async (files: Record<string, string>) => {
    if (!latestFragmentMessage?.fragment) {
      throw new Error("No fragment found");
    }

    await updateFragment.mutateAsync({
      fragmentId: latestFragmentMessage.fragment.id,
      files,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!latestFragmentMessage?.fragment) {
    return <div>No fragment available</div>;
  }

  return (
    <div className="h-screen w-full">
      <FileExplorer
        files={latestFragmentMessage.fragment.files as Record<string, string>}
        messageId={latestFragmentMessage.id}
        onSave={handleSaveFiles}
        allowEdit={true}
      />
    </div>
  );
}