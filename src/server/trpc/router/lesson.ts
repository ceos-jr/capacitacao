import { LessonWUtils } from "src/pages/lessons/[lessonId]/edit";
import { z } from "zod";

import { router, publicProcedure, adminProcedure } from "../trpc";

export const lessonRouter = router({
  getLesson: publicProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: { links: true, videos: true, projects: true },
      });
    }),
  updateLessonWUtils: adminProcedure
    .input(LessonWUtils)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.lesson.update({
        where: { id: input.id },
        data: {
          name: input.name,
          richText: input.richText,
          videos: { createMany: { data: input.videos } },
          links: { createMany: { data: input.links } },
          projects: { createMany: { data: input.projects } },
        },
      });
    }),
  updateVideo: adminProcedure.input(LessonWUtils).query(({ input, ctx }) => {
    return ctx.prisma.lesson.update({
      where: { id: input.id },
      data: {
        name: input.name,
        richText: input.richText,
      },
    });
  }),
});
