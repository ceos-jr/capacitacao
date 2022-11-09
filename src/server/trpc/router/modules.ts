import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const moduleRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.module.findMany({});
  }),
  getUnique: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma?.module.findUnique({
        where: { id: input.id },
        include: {
          lessons: {
            include: {
              _count: { select: { tasks: true } },
            },
          },
        },
      });
    }),
});
