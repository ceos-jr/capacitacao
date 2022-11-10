import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const lessonRouter = router({
  getLesson: publicProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: { links: true, videos: true, projects: true },
      });
    }),
  // getUnique: publicProcedure
  //   .input(z.object({ id: z.string().nullish(), userId: z.string().nullish() }))
  //   .query(({ input }) => {
  //     if (input.id && input.userId) {
  //       return prisma?.module.findUnique({
  //         where: { id: input.id },
  //         include: {
  //           lessons: {
  //             include: {
  //               _count: { select: { tasks: true } },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }),
});
