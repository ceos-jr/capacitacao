import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

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
            include: {
              _count: { select: { tasks: true } },
            },
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
    .input(z.object({ moduleId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.create({
        data: {
          userId: ctx.session.user.id,
          moduleId: input.moduleId,
        },
      });
    }),
});
