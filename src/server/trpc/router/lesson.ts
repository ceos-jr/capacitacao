import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const lessonRouter = router({
  getLesson: publicProcedure
    .input(z.object({ lessonId: z.string().nullish() }))
    .query(({ ctx, input }) => {
      if (input.lessonId)
        return ctx.prisma.lesson.findUnique({ where: { id: input.lessonId } });
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
