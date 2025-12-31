"use client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField } from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ChevronDown, ChevronUp, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(10000, { message: "Prompt is too long" }),
});

const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Show More / Show Less State
  const [showAll, setShowAll] = useState(false);
  const INITIAL_LIMIT = 8; // এখানে আপনি কতগুলো টেমপ্লেট ইনিশিয়ালি দেখাতে চান তা সেট করতে পারেন

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);

        //todo invalidate usage status
      },
      onError: (error) => {
        //todo redirect to pricing page
        toast.error(error.message);
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  // যতগুলো টেমপ্লেট দেখাতে হবে তা ক্যালকুলেট করা
  const visibleTemplates = showAll
    ? PROJECT_TEMPLATES
    : PROJECT_TEMPLATES.slice(0, INITIAL_LIMIT);

  const hasMoreTemplates = PROJECT_TEMPLATES.length > INITIAL_LIMIT;

  return (
    
      <Form {...form}>
        <section className="space-y-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
              isFocused && "shadow-xs"
            )}
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={2}
                  maxRows={8}
                  className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                  placeholder="What would you like to build"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                />
              )}
            />
            <div className="flex gap-x-2 items-end justify-between pt-2">
              <div className="text-[10px] text-muted-foreground font-mono">
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  <span>&#8984;</span> Enter
                </kbd>
                &nbsp;to submit
              </div>
              <Button
                disabled={isButtonDisabled}
                className={cn(
                  "size-8 rounded-full",
                  isButtonDisabled && "bg-muted-foreground"
                )}
              >
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ArrowUpIcon />
                )}
              </Button>
            </div>
          </form>

          {/* Templates Section */}
          <div className=" flex-wrap justify-center gap-2 hidden md:flex max-w-3xl items-center">
            {visibleTemplates.map((template) => {
              return (
                <Button
                  key={template.title}
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-sidebar"
                  onClick={() => onSelect(template.prompt)}
                >
                  {template.emoji} {template.title}
                </Button>
              );
            })}

            {/* Show More / Show Less Button */}
            {hasMoreTemplates && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="bg-white dark:bg-sidebar"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="size-4 mr-1 bg-accent" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4 mr-1 bg-accent" />
                    See more templates
                  </>
                )}
              </Button>
            )}
          </div>
        </section>
      </Form>
      
  );
};

export default ProjectForm;
