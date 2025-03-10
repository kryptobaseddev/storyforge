/**
 * Root Router
 * 
 * This file contains the root tRPC router which combines all other routers.
 */

import { router } from '../trpc';

// Import all routers here
import { authRouter } from './auth.router';
import { projectRouter } from './project.router';
import { characterRouter } from './character.router';
import { settingRouter } from './setting.router';
import { plotRouter } from './plot.router';
import { userRouter } from './user.router';
import { chapterRouter } from './chapter.router';
import { aiRouter } from './ai.router';
import { exportRouter } from './export.router';
import { objectRouter } from './object.router';

/**
 * Create the root router
 * This combines all routers into a single router
 */
export const appRouter = router({
  // Merge all routers under their namespace
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
  character: characterRouter,
  setting: settingRouter,
  plot: plotRouter,
  chapter: chapterRouter,
  ai: aiRouter,
  export: exportRouter,
  object: objectRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter; 