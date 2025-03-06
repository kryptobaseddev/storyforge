"use strict";
/**
 * Root Router
 *
 * This file contains the root tRPC router which combines all other routers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
// Import all routers here
const auth_router_1 = require("./auth.router");
const project_router_1 = require("./project.router");
const character_router_1 = require("./character.router");
const setting_router_1 = require("./setting.router");
const plot_router_1 = require("./plot.router");
const user_router_1 = require("./user.router");
const chapter_router_1 = require("./chapter.router");
const ai_router_1 = require("./ai.router");
const export_router_1 = require("./export.router");
/**
 * Create the root router
 * This combines all routers into a single router
 */
exports.appRouter = (0, trpc_1.router)({
    // Merge all routers under their namespace
    auth: auth_router_1.authRouter,
    user: user_router_1.userRouter,
    project: project_router_1.projectRouter,
    character: character_router_1.characterRouter,
    setting: setting_router_1.settingRouter,
    plot: plot_router_1.plotRouter,
    chapter: chapter_router_1.chapterRouter,
    ai: ai_router_1.aiRouter,
    export: export_router_1.exportRouter,
});
