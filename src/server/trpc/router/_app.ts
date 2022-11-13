import { router } from "../trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { lessonRouter } from "./lesson";
import { moduleRouter } from "./modules";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  module: moduleRouter,
  lesson: lessonRouter,
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
