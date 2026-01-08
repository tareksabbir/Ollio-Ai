"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProjectsList = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Project deleted successfully");
        setDeleteId(null);
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
      },
      onError: () => {
        toast.error("Failed to delete project");
      },
    })
  );

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  return (
    <>
      <section className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4 mb-50">
        <h2 className="text-xl font-semibold text-center">
          Hi, {user?.firstName} Your Recent Works!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex items-center gap-x-4"
                >
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex flex-col gap-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : projects?.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="text-sm text-muted-foreground">
                No projects yet. Start a conversation!
              </p>
            </div>
          ) : (
            projects?.map((project) => {
              const latestFragment = project.messages?.[0]?.fragment;
              const displayTitle = latestFragment?.title || project.name;

              return (
                <div key={project.id} className="relative group">
                  <Button
                    variant="outline"
                    className="font-normal h-auto justify-start w-full text-start p-4"
                    asChild
                  >
                    <Link href={`/projects/${project.id}`}>
                      <div className="flex items-center gap-x-4">
                        <Image
                          src="/logo.svg"
                          alt="ollio"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <div className="flex flex-col flex-1">
                          <h3 className="truncate font-medium pr-8">
                            {displayTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(project.updatedAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleDelete(e, project.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project and all associated messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsList;
