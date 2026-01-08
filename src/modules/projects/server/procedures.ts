// import z from "zod";
// import { inngest } from "@/inngest/client";
// import prisma from "@/lib/db";
// import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { generateSlug } from "random-word-slugs";
// import { TRPCError } from "@trpc/server";
// import { consumeCredits } from "@/lib/usage";

// export const projectsRouter = createTRPCRouter({
//   getOne: protectedProcedure
//     .input(
//       z.object({
//         id: z.string().min(1, {
//           message: "Project ID is required",
//         }),
//       })
//     )
//     .query(async ({ input, ctx }) => {
//       const existingProjects = await prisma.project.findUnique({
//         where: {
//           id: input.id,
//           userId: ctx.auth.userId,
//         },
//       });
//       if (!existingProjects) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Project not found",
//         });
//       }
//       return existingProjects;
//     }),

//   getMany: protectedProcedure.query(async ({ ctx }) => {
//     const projects = await prisma.project.findMany({
//       where: {
//         userId: ctx.auth.userId,
//       },
//       include: {
//         messages: {
//           include: {
//             fragment: true,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//           take: 1,
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });
//     return projects;
//   }),

//   create: protectedProcedure
//     .input(
//       z.object({
//         value: z
//           .string()
//           .min(1, { message: "Prompt is required" })
//           .max(10000, { message: "Prompt is too long" }),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       try {
//         await consumeCredits();
//       } catch (error) {
//         if (error instanceof Error) {
//           throw new TRPCError({
//             code: "BAD_REQUEST",
//             message: "Something went wrong!",
//           });
//         } else {
//           throw new TRPCError({
//             code: "TOO_MANY_REQUESTS",
//             message: "You have run out of credits!",
//           });
//         }
//       }
//       const createdProject = await prisma.project.create({
//         data: {
//           userId: ctx.auth.userId,
//           name: generateSlug(2, {
//             format: "kebab",
//           }),
//           messages: {
//             create: {
//               content: input.value,
//               role: "USER",
//               type: "RESULT",
//             },
//           },
//         },
//       });

//       await inngest.send({
//         name: "ui-Generation-Agent/run",
//         data: { value: input.value, projectId: createdProject.id },
//       });
//       return createdProject;
//     }),

//   delete: protectedProcedure
//     .input(
//       z.object({
//         id: z.string().min(1, {
//           message: "Project ID is required",
//         }),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const project = await prisma.project.findUnique({
//         where: {
//           id: input.id,
//           userId: ctx.auth.userId,
//         },
//       });

//       if (!project) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Project not found",
//         });
//       }

//       await prisma.project.delete({
//         where: {
//           id: input.id,
//           userId: ctx.auth.userId,
//         },
//       });

//       return { success: true };
//     }),
// });


import z from "zod";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, {
          message: "Project ID is required",
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      // ✅ Cache এ রাখার জন্য consistent query
      const existingProjects = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        // ✅ Select specific fields - unnecessary data load কম হবে
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      if (!existingProjects) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      
      return existingProjects;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    // ✅ Optimized query with selective includes
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        messages: {
          include: {
            fragment: {
              // ✅ Fragment থেকে শুধু প্রয়োজনীয় fields
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // শুধু সর্বশেষ message
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      // ✅ Limit results - pagination করলে আরো ভালো হবে
      take: 50, // Maximum 50 projects show করবে
    });
    
    return projects;
  }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong!",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits!",
          });
        }
      }
      
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: "Untitled",
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
        // ✅ Return করার সময় selective data
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await inngest.send({
        name: "ui-Generation-Agent/run",
        data: { value: input.value, projectId: createdProject.id },
      });
      
      return createdProject;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, {
          message: "Project ID is required",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ✅ Check existence first
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        select: {
          id: true, // শুধু id check করলেই হবে
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // ✅ Delete operation
      await prisma.project.delete({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      return { success: true, deletedId: input.id };
    }),
  
  // ✅ BONUS: Pagination support
  getManyPaginated: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const projects = await prisma.project.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        include: {
          messages: {
            include: {
              fragment: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: input.limit + 1, // +1 for next cursor
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined = undefined;
      if (projects.length > input.limit) {
        const nextItem = projects.pop();
        nextCursor = nextItem?.id;
      }

      return {
        projects,
        nextCursor,
      };
    }),
});