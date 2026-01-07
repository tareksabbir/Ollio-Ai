"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, UploadCloud, ArrowLeft } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/header-footer/navbar";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title is too long" }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().url({ message: "Please enter a valid URL" }),
  code: z.string().min(10, { message: "HTML code is too short" }),
});

const categories = [
  "Landing Pages",
  "Advanced Apps",
  "Business Tools",
  "Personal Tools",
  "E-Commerce",
];

export default function UploadProjectPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      image: "",
      code: "",
    },
  });

  const uploadProject = useMutation(
    trpc.htmlCode.create.mutationOptions({
      onSuccess: () => {
        toast.success("Project uploaded successfully!");
        form.reset();
        queryClient.invalidateQueries(trpc.htmlCode.getMany.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await uploadProject.mutateAsync(values);
  };

  const isPending = uploadProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 mt-30 ">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Showcase
            </Link>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-sidebar p-15 rounded-xl border border-border">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title
                </label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g. Sora Automate"
                      disabled={isPending}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500 mt-2">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && (
                  <p className="text-xs text-red-500 mt-2">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Image URL
                </label>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://example.com/thumbnail.png"
                      disabled={isPending}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use a direct link to an image (PNG, JPG, WebP).
                </p>
                {form.formState.errors.image && (
                  <p className="text-xs text-red-500 mt-2">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              {/* Code Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  HTML Code
                </label>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <TextareaAutosize
                      {...field}
                      disabled={isPending}
                      minRows={15}
                      maxRows={20}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
                      placeholder="<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>My Project</title>
</head>
<body>
    <!-- Your code here -->
</body>
</html>"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Paste the complete HTML code including CSS and JavaScript
                </p>
                {form.formState.errors.code && (
                  <p className="text-xs text-red-500 mt-2">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  disabled={isButtonDisabled}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <>
                      <UploadCloud className="size-4 mr-2" />
                      Upload Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
// "use client";

// import { z } from "zod";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import TextareaAutosize from "react-textarea-autosize";
// import { Form, FormField } from "@/components/ui/form";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2Icon, UploadCloud, ArrowLeft } from "lucide-react";
// import { useTRPC } from "@/trpc/client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import Link from "next/link";

// const formSchema = z.object({
//   title: z
//     .string()
//     .min(1, { message: "Title is required" })
//     .max(100, { message: "Title is too long" }),
//   category: z.string().min(1, { message: "Category is required" }),
//   image: z.string().url({ message: "Please enter a valid URL" }),
//   code: z.string().min(10, { message: "HTML code is too short" }),
// });

// const categories = [
//   "Landing Pages",
//   "Advanced Apps",
//   "Business Tools",
//   "Personal Tools",
//   "E-Commerce",
// ];

// export default function UploadProjectPage() {
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();
//   const [isFocused, setIsFocused] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       category: "",
//       image: "",
//       code: "",
//     },
//   });

//   const uploadProject = useMutation(
//     trpc.htmlCode.create.mutationOptions({
//       onSuccess: () => {
//         toast.success("Project uploaded successfully!");
//         form.reset();
//         queryClient.invalidateQueries(trpc.htmlCode.getMany.queryOptions());
//       },
//       onError: (error) => {
//         toast.error(error.message || "Something went wrong");
//       },
//     })
//   );

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     await uploadProject.mutateAsync(values);
//   };

//   const isPending = uploadProject.isPending;
//   const isButtonDisabled = isPending || !form.formState.isValid;

//   return (
//     <div className="min-h-screen py-10">
//       <div className="max-w-3xl mx-auto px-4">
//         {/* Back Button */}
//         <div className="mb-6">
//           <Link
//             href="/"
//             className="inline-flex items-center text-sm font-medium "
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Showcase
//           </Link>
//         </div>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className={cn(
//               "relative border p-4 pt-3 rounded-xl bg-sidebar dark:bg-sidebar transition-all space-y-4",
//               isFocused && "shadow-xs"
//             )}
//           >
//             {/* Title Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">
//                 Project Title
//               </label>
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="e.g. Sora Automate"
//                     disabled={isPending}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     className="border-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                   />
//                 )}
//               />
//               {form.formState.errors.title && (
//                 <p className="text-xs text-red-500">
//                   {form.formState.errors.title.message}
//                 </p>
//               )}
//             </div>

//             {/* Category Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">
//                 Category
//               </label>
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     disabled={isPending}
//                   >
//                     <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:ring-offset-0">
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((cat) => (
//                         <SelectItem key={cat} value={cat}>
//                           {cat}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {form.formState.errors.category && (
//                 <p className="text-xs text-red-500">
//                   {form.formState.errors.category.message}
//                 </p>
//               )}
//             </div>

//             {/* Image URL Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">
//                 Cover Image URL
//               </label>
//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="https://example.com/thumbnail.png"
//                     disabled={isPending}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     className="border-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                   />
//                 )}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use a direct link to an image (PNG, JPG, WebP).
//               </p>
//               {form.formState.errors.image && (
//                 <p className="text-xs text-red-500">
//                   {form.formState.errors.image.message}
//                 </p>
//               )}
//             </div>

//             {/* Code Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">
//                 HTML Code
//               </label>
//               <FormField
//                 control={form.control}
//                 name="code"
//                 render={({ field }) => (
//                   <TextareaAutosize
//                     {...field}
//                     disabled={isPending}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     minRows={8}
//                     maxRows={20}
//                     className="resize-none border-none w-full outline-none bg-transparent font-mono text-sm"
//                     placeholder="<!DOCTYPE html>
// <html lang='en'>
// <head>
//     <meta charset='UTF-8'>
//     <title>My Project</title>
// </head>
// <body>
//     <!-- Your code here -->
// </body>
// </html>"
//                   />
//                 )}
//               />
//               {form.formState.errors.code && (
//                 <p className="text-xs text-red-500">
//                   {form.formState.errors.code.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex gap-x-2 items-end justify-between pt-2">
//               <div className="text-[10px] text-muted-foreground font-mono">
//                 <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
//                   <span>&#8984;</span> Enter
//                 </kbd>
//                 &nbsp;to submit
//               </div>
//               <Button
//                 disabled={isButtonDisabled}
//                 className={cn(
//                   "size-8 rounded-full",
//                   isButtonDisabled && "bg-muted-foreground"
//                 )}
//               >
//                 {isPending ? (
//                   <Loader2Icon className="size-4 animate-spin" />
//                 ) : (
//                   <UploadCloud className="size-4" />
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
