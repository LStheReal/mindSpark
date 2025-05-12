import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  flashcardSets, type FlashcardSet, type InsertFlashcardSet,
  flashcards, type Flashcard, type InsertFlashcard,
  studyProgress, type StudyProgress, type InsertStudyProgress,
  classrooms, type Classroom, type InsertClassroom,
  classroomMembers, type ClassroomMember, type InsertClassroomMember,
  classroomSets, type ClassroomSet, type InsertClassroomSet,
  quizzes, type Quiz, type InsertQuiz,
  quizResults, type QuizResult, type InsertQuizResult
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async upsertUser(user: InsertUser): Promise<User> {
    const [upsertedUser] = await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...user,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.userId, userId));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Flashcard set operations
  async getFlashcardSets(): Promise<FlashcardSet[]> {
    return db.select().from(flashcardSets);
  }

  async getFlashcardSetsByUserId(userId: string): Promise<FlashcardSet[]> {
    return db.select().from(flashcardSets).where(eq(flashcardSets.userId, userId));
  }

  async getFlashcardSetsByCategoryId(categoryId: number): Promise<FlashcardSet[]> {
    return db.select().from(flashcardSets).where(eq(flashcardSets.categoryId, categoryId));
  }

  async getFlashcardSet(id: number): Promise<FlashcardSet | undefined> {
    const [set] = await db.select().from(flashcardSets).where(eq(flashcardSets.id, id));
    return set;
  }

  async createFlashcardSet(set: InsertFlashcardSet): Promise<FlashcardSet> {
    const [newSet] = await db
      .insert(flashcardSets)
      .values(set)
      .returning();
    return newSet;
  }

  async updateFlashcardSet(id: number, set: Partial<FlashcardSet>): Promise<FlashcardSet> {
    const [updatedSet] = await db
      .update(flashcardSets)
      .set(set)
      .where(eq(flashcardSets.id, id))
      .returning();
    
    if (!updatedSet) {
      throw new Error(`Flashcard set with id ${id} not found`);
    }
    
    return updatedSet;
  }

  async deleteFlashcardSet(id: number): Promise<void> {
    await db.delete(flashcardSets).where(eq(flashcardSets.id, id));
  }

  // Flashcard operations
  async getFlashcardsBySetId(setId: number): Promise<Flashcard[]> {
    return db.select().from(flashcards).where(eq(flashcards.setId, setId));
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [card] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return card;
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db
      .insert(flashcards)
      .values(flashcard)
      .returning();
    return newFlashcard;
  }

  async updateFlashcard(id: number, flashcard: Partial<Flashcard>): Promise<Flashcard> {
    const [updatedFlashcard] = await db
      .update(flashcards)
      .set(flashcard)
      .where(eq(flashcards.id, id))
      .returning();
    
    if (!updatedFlashcard) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  }

  // Study progress operations
  async getStudyProgressByUserId(userId: string): Promise<StudyProgress[]> {
    return db.select().from(studyProgress).where(eq(studyProgress.userId, userId));
  }

  async getStudyProgressByFlashcardId(flashcardId: number): Promise<StudyProgress | undefined> {
    const [progress] = await db.select().from(studyProgress).where(eq(studyProgress.flashcardId, flashcardId));
    return progress;
  }

  async createStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress> {
    const [newProgress] = await db
      .insert(studyProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async updateStudyProgress(id: number, progress: Partial<StudyProgress>): Promise<StudyProgress> {
    const [updatedProgress] = await db
      .update(studyProgress)
      .set(progress)
      .where(eq(studyProgress.id, id))
      .returning();
    
    if (!updatedProgress) {
      throw new Error(`Study progress with id ${id} not found`);
    }
    
    return updatedProgress;
  }

  // Classroom operations
  async getClassrooms(): Promise<Classroom[]> {
    return db.select().from(classrooms);
  }

  async getClassroomsByUserId(userId: string): Promise<Classroom[]> {
    // Find classrooms where user is a member
    const memberClasses = await db
      .select({
        classroomId: classroomMembers.classroomId
      })
      .from(classroomMembers)
      .where(eq(classroomMembers.userId, userId));
    
    const memberClassroomIds = memberClasses.map(row => row.classroomId);
    
    // Find classrooms where user is owner
    const allClassrooms = await db
      .select()
      .from(classrooms)
      .where(
        or(
          eq(classrooms.ownerId, userId),
          inArray(classrooms.id, memberClassroomIds)
        )
      );
    
    return allClassrooms;
  }

  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const [newClassroom] = await db
      .insert(classrooms)
      .values(classroom)
      .returning();
    return newClassroom;
  }

  async getClassroomMembers(classroomId: number): Promise<ClassroomMember[]> {
    return db.select().from(classroomMembers).where(eq(classroomMembers.classroomId, classroomId));
  }

  async addClassroomMember(member: InsertClassroomMember): Promise<ClassroomMember> {
    const [newMember] = await db
      .insert(classroomMembers)
      .values(member)
      .returning();
    return newMember;
  }

  // Classroom sets operations
  async getClassroomSets(classroomId: number): Promise<ClassroomSet[]> {
    return db.select().from(classroomSets).where(eq(classroomSets.classroomId, classroomId));
  }

  async addClassroomSet(classroomSet: InsertClassroomSet): Promise<ClassroomSet> {
    const [newClassroomSet] = await db
      .insert(classroomSets)
      .values(classroomSet)
      .returning();
    return newClassroomSet;
  }

  // Quiz operations
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db
      .insert(quizzes)
      .values(quiz)
      .returning();
    return newQuiz;
  }

  async getQuizzesByUserId(userId: string): Promise<Quiz[]> {
    return db.select().from(quizzes).where(eq(quizzes.userId, userId));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  // Quiz results operations
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [newResult] = await db
      .insert(quizResults)
      .values(result)
      .returning();
    return newResult;
  }

  async getQuizResultsByUserId(userId: string): Promise<QuizResult[]> {
    return db.select().from(quizResults).where(eq(quizResults.userId, userId));
  }

  // Recent studies operations (this would need to be implemented with a separate table in a real DB)
  private recentStudies: any[] = [];
  
  async getRecentStudies(): Promise<any[]> {
    return this.recentStudies;
  }

  async addRecentStudy(study: { setId: number, progress: number, lastStudied: string }): Promise<void> {
    this.recentStudies.push(study);
  }
}