import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Use Replit's user ID as our primary key
  username: text("username"),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  userPlan: text("user_plan").default("free").notNull(), // "free", "pro" (own API key), or "premium" (subscription)
  apiKey: text("api_key"), // User's OpenAI API key (encrypted in production)
  stripeCustomerId: text("stripe_customer_id"), // For premium subscriptions
  stripeSubscriptionId: text("stripe_subscription_id"), // For premium subscriptions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcardSets = pgTable("flashcard_sets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id"),
  isPublic: boolean("is_public").default(false),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  setId: integer("set_id").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyProgress = pgTable("study_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  flashcardId: integer("flashcard_id").notNull(),
  status: text("status").default("new"), // "new", "learning", "known"
  lastStudied: timestamp("last_studied").defaultNow(),
  nextReview: timestamp("next_review").defaultNow(),
});

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").notNull(),
  inviteCode: text("invite_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classroomMembers = pgTable("classroom_members", {
  id: serial("id").primaryKey(),
  classroomId: integer("classroom_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("student"), // "student", "teacher"
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const classroomSets = pgTable("classroom_sets", {
  id: serial("id").primaryKey(),
  classroomId: integer("classroom_id").notNull(),
  setId: integer("set_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  setId: integer("set_id").notNull(),
  userId: integer("user_id").notNull(),
  quizType: text("quiz_type").default("multiple_choice"), // "multiple_choice", "fill_blank", "matching", "mixed"
  questions: json("questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  answers: json("answers"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  userPlan: true,
  apiKey: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  userId: true,
  color: true,
});

export const insertFlashcardSetSchema = createInsertSchema(flashcardSets).pick({
  title: true,
  description: true,
  userId: true,
  categoryId: true,
  isPublic: true,
  color: true,
});

export const insertFlashcardSchema = createInsertSchema(flashcards).pick({
  question: true,
  answer: true,
  setId: true,
  imageUrl: true,
});

export const insertStudyProgressSchema = createInsertSchema(studyProgress).pick({
  userId: true,
  flashcardId: true,
  status: true,
  lastStudied: true,
  nextReview: true,
});

export const insertClassroomSchema = createInsertSchema(classrooms).pick({
  name: true,
  description: true,
  ownerId: true,
  inviteCode: true,
});

export const insertClassroomMemberSchema = createInsertSchema(classroomMembers).pick({
  classroomId: true,
  userId: true,
  role: true,
});

export const insertClassroomSetSchema = createInsertSchema(classroomSets).pick({
  classroomId: true,
  setId: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  title: true,
  setId: true,
  userId: true,
  quizType: true,
  questions: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  quizId: true,
  userId: true,
  score: true,
  maxScore: true,
  answers: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertFlashcardSet = z.infer<typeof insertFlashcardSetSchema>;
export type FlashcardSet = typeof flashcardSets.$inferSelect;

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
export type StudyProgress = typeof studyProgress.$inferSelect;

export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type Classroom = typeof classrooms.$inferSelect;

export type InsertClassroomMember = z.infer<typeof insertClassroomMemberSchema>;
export type ClassroomMember = typeof classroomMembers.$inferSelect;

export type InsertClassroomSet = z.infer<typeof insertClassroomSetSchema>;
export type ClassroomSet = typeof classroomSets.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
