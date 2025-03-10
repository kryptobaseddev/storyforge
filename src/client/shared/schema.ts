import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarInitial: text("avatar_initial").default("U"),
  accountType: text("account_type").default("Free"),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  clerkUserId: text("clerk_user_id").unique(), // Add Clerk user ID for linking accounts
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  coverInitial: text("cover_initial").default("P"),
  coverColor: text("cover_color").default("#5D3FD3"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  role: text("role"), // Protagonist, Antagonist, Supporting, etc.
  archetype: text("archetype"), // e.g. Dark Sorcerer, Elven Ranger
  appearance: text("appearance"),
  personality: text("personality"),
  background: text("background"),
  speech: text("speech"),
  age: text("age"),
  gender: text("gender"),
  race: text("race"),
  occupation: text("occupation"),
  avatarInitial: text("avatar_initial").default("C"),
  avatarColor: text("avatar_color").default("#2563EB"),
  strengths: jsonb("strengths").default([]),
  weaknesses: jsonb("weaknesses").default([]),
  motivations: jsonb("motivations").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type"), // City, Kingdom, Room, etc.
  details: text("details"),
  climate: text("climate"),
  culture: text("culture"),
  history: text("history"),
  iconInitial: text("icon_initial").default("S"),
  iconColor: text("icon_color").default("#16A34A"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const objects = pgTable("objects", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type"), // Weapon, Tool, Magical Item, etc.
  properties: text("properties"),
  history: text("history"),
  ownerId: integer("owner_id").references(() => characters.id),
  locationId: integer("location_id").references(() => settings.id),
  iconInitial: text("icon_initial").default("O"),
  iconColor: text("icon_color").default("#D97706"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plots = pgTable("plots", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  description: text("description"),
  plotType: text("plot_type"), // Main, Subplot, Character Arc
  structure: text("structure"), // Three-Act, Hero's Journey, etc.
  iconInitial: text("icon_initial").default("P"),
  iconColor: text("icon_color").default("#DC2626"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plotElements = pgTable("plot_elements", {
  id: serial("id").primaryKey(),
  plotId: integer("plot_id").notNull().references(() => plots.id),
  name: text("name").notNull(),
  description: text("description"),
  elementType: text("element_type"), // Inciting Incident, Climax, etc.
  sequence: integer("sequence").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plotElementCharacters = pgTable("plot_element_characters", {
  id: serial("id").primaryKey(),
  plotElementId: integer("plot_element_id").notNull().references(() => plotElements.id),
  characterId: integer("character_id").notNull().references(() => characters.id),
});

export const plotElementSettings = pgTable("plot_element_settings", {
  id: serial("id").primaryKey(),
  plotElementId: integer("plot_element_id").notNull().references(() => plotElements.id),
  settingId: integer("setting_id").notNull().references(() => settings.id),
});

export const plotElementObjects = pgTable("plot_element_objects", {
  id: serial("id").primaryKey(),
  plotElementId: integer("plot_element_id").notNull().references(() => plotElements.id),
  objectId: integer("object_id").notNull().references(() => objects.id),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  content: text("content").default(""),
  sequence: integer("sequence").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scenes = pgTable("scenes", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull().references(() => chapters.id),
  name: text("name").notNull(),
  content: text("content").default(""),
  sequence: integer("sequence").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sceneCharacters = pgTable("scene_characters", {
  id: serial("id").primaryKey(),
  sceneId: integer("scene_id").notNull().references(() => scenes.id),
  characterId: integer("character_id").notNull().references(() => characters.id),
});

export const sceneSettings = pgTable("scene_settings", {
  id: serial("id").primaryKey(),
  sceneId: integer("scene_id").notNull().references(() => scenes.id),
  settingId: integer("setting_id").notNull().references(() => settings.id),
});

export const sceneObjects = pgTable("scene_objects", {
  id: serial("id").primaryKey(),
  sceneId: integer("scene_id").notNull().references(() => scenes.id),
  objectId: integer("object_id").notNull().references(() => objects.id),
});

export const scenePlotElements = pgTable("scene_plot_elements", {
  id: serial("id").primaryKey(), 
  sceneId: integer("scene_id").notNull().references(() => scenes.id),
  plotElementId: integer("plot_element_id").notNull().references(() => plotElements.id),
});

export const characterRelationships = pgTable("character_relationships", {
  id: serial("id").primaryKey(),
  characterAId: integer("character_a_id").notNull().references(() => characters.id),
  characterBId: integer("character_b_id").notNull().references(() => characters.id),
  relationship: text("relationship").notNull(), // Friend, Enemy, Family, etc.
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarInitial: true,
  accountType: true,
  clerkUserId: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  description: true,
  coverInitial: true,
  coverColor: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertObjectSchema = createInsertSchema(objects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlotSchema = createInsertSchema(plots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlotElementSchema = createInsertSchema(plotElements).omit({
  id: true,
  createdAt: true, 
  updatedAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertSceneSchema = createInsertSchema(scenes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

export type InsertObject = z.infer<typeof insertObjectSchema>;
export type Object = typeof objects.$inferSelect;

export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type Plot = typeof plots.$inferSelect;

export type InsertPlotElement = z.infer<typeof insertPlotElementSchema>;
export type PlotElement = typeof plotElements.$inferSelect;

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

export type InsertScene = z.infer<typeof insertSceneSchema>;
export type Scene = typeof scenes.$inferSelect;
