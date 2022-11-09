import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { lessonRouter } from "./lesson";
import { moduleRouter } from "./modules";

export const appRouter = router({
  example: exampleRouter,
  module: moduleRouter,
  lesson: lessonRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
