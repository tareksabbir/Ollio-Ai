"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

const ProjectsList = () => {
  const trpc = useTRPC();
  const {user} = useUser()
  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  return (
    <section className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-xl font-semibold">Hi,{user?.firstName} Your Recent Works!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton loading state
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
            return (
              <Button
                key={project.id}
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
                    <div className="flex flex-col">
                      <h3 className="truncate font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(project.updatedAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ProjectsList;
