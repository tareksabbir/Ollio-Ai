"use client";

import FileExplorer from "@/components/code-view/file-explorer";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  fragment?: {
    id: string;
    files: Record<string, string>;
    sandboxUrl: string;
  } | null;
}

interface ProjectPageProps {
  messages: Message[];
  projectId: string;
}

const ProjectPage = ({ messages }: ProjectPageProps) => {
  const trpc = useTRPC();

  // ✅ Fragment update mutation
  const updateFragment = useMutation(
    trpc.fragments.update.mutationOptions({
      onSuccess: () => {
        toast.success("Fragment updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update fragment: " + error.message);
      },
    })
  );

  // ✅ onSave handler with correct signature
  const handleSaveFiles = async (
    fragmentId: string,
    files: Record<string, string>
  ) => {
    await updateFragment.mutateAsync({
      fragmentId,
      files,
    });
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.fragment && (
            <div className="h-150">
              <FileExplorer
                files={message.fragment.files as Record<string, string>}
                fragmentId={message.fragment.id} // ✅ fragmentId pass korchi
                onSave={handleSaveFiles} // ✅ handler pass korchi
                allowEdit={true}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectPage;
