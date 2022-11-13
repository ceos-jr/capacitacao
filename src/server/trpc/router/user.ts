import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getMostRecentMod: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.findMany({
        where: { userId: ctx.session.user.id, completed: false },
        include: {
          module: { select: { name: true, description: true } },
          lessonProg: { select: { completed: true } },
        },
        orderBy: { lastTimeSeen: "desc" },
        take: input,
      });
    }),
  getNumModInProg: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userModuleProgress.count({
      where: { userId: ctx.session.user.id, completed: false },
    });
  }),
  getLesInProg: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userLessonProgress.findMany({
      where: { userId: ctx.session.user.id, completed: false },
    });
  }),
  getTaskInProg: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userTaskProgress.findMany({
      where: { userId: ctx.session.user.id, completed: false },
    });
  }),
  updModLastSeen: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userModuleProgress.update({
        where: {
          userId_moduleId: { userId: ctx.session.user.id, moduleId: input },
        },
        data: { lastTimeSeen: new Date() },
      });
    }),
  updLessLastSeen: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userLessonProgress.update({
        where: {
          userId_lessonId: { userId: ctx.session.user.id, lessonId: input },
        },
        data: { lastTimeSeen: new Date() },
      });
    }),
});