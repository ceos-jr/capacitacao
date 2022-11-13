import { FormSchema } from "src/pages/modules/create";
import { z } from "zod";

import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc";

export const moduleRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.module.findMany({});
  }),
  getUnique: publicProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ input }) => {
      return prisma?.module.findUnique({
        where: { id: input.moduleId },
        include: {
          lessons: {
            select: {
              id: true,
              name: true,
              tasks: { select: { id: true } },
            },
            orderBy: { index: "asc" },
          },
        },
      });
    }),
  getUserModStats: protectedProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: ctx.session.user.id,
            moduleId: input.moduleId,
          },
        },
      });
    }),
  subsToModule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        lessons: z.array(z.object({ id: z.string() })),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.create({
        data: {
          userId: ctx.session.user.id,
          moduleId: input.id,
          lessonProg: {
            createMany: {
              data: input.lessons.map((lesson) => ({ lessonId: lesson.id })),
            },
          },
        },
      });
    }),
  desubToModule: protectedProcedure
    .input(
      z.object({
        moduleId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.delete({
        where: {
          userId_moduleId: {
            moduleId: input.moduleId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  createModWLessons: adminProcedure
    .input(FormSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.module.create({
        data: {
          name: input.name,
          description: input.description,
          lessons: {
            createMany: {
              data: input.lessons,
            },
          },
        },
      });
    }),
  updSttsOnModSugg: adminProcedure
    .input(z.object({ id: z.string(), readed: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.modSuggestion.update({
        where: { id: input.id },
        data: { readed: input.readed },
      });
    }),
});
