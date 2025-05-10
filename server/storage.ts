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

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoriesByUserId(userId: number): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Flashcard set operations
  getFlashcardSets(): Promise<FlashcardSet[]>;
  getFlashcardSetsByUserId(userId: number): Promise<FlashcardSet[]>;
  getFlashcardSetsByCategoryId(categoryId: number): Promise<FlashcardSet[]>;
  getFlashcardSet(id: number): Promise<FlashcardSet | undefined>;
  createFlashcardSet(set: InsertFlashcardSet): Promise<FlashcardSet>;
  updateFlashcardSet(id: number, set: Partial<FlashcardSet>): Promise<FlashcardSet>;
  deleteFlashcardSet(id: number): Promise<void>;
  
  // Flashcard operations
  getFlashcardsBySetId(setId: number): Promise<Flashcard[]>;
  getFlashcard(id: number): Promise<Flashcard | undefined>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, flashcard: Partial<Flashcard>): Promise<Flashcard>;
  deleteFlashcard(id: number): Promise<void>;
  
  // Study progress operations
  getStudyProgressByUserId(userId: number): Promise<StudyProgress[]>;
  getStudyProgressByFlashcardId(flashcardId: number): Promise<StudyProgress | undefined>;
  createStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress>;
  updateStudyProgress(id: number, progress: Partial<StudyProgress>): Promise<StudyProgress>;
  
  // Classroom operations
  getClassrooms(): Promise<Classroom[]>;
  getClassroomsByUserId(userId: number): Promise<Classroom[]>;
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  getClassroomMembers(classroomId: number): Promise<ClassroomMember[]>;
  addClassroomMember(member: InsertClassroomMember): Promise<ClassroomMember>;
  
  // Classroom sets operations
  getClassroomSets(classroomId: number): Promise<ClassroomSet[]>;
  addClassroomSet(classroomSet: InsertClassroomSet): Promise<ClassroomSet>;
  
  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizzesByUserId(userId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  
  // Quiz results operations
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResultsByUserId(userId: number): Promise<QuizResult[]>;
  
  // Recent studies operations
  getRecentStudies(): Promise<any[]>;
  addRecentStudy(study: { setId: number, progress: number, lastStudied: string }): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private flashcardSets: Map<number, FlashcardSet>;
  private flashcards: Map<number, Flashcard>;
  private studyProgresses: Map<number, StudyProgress>;
  private classrooms: Map<number, Classroom>;
  private classroomMembers: Map<number, ClassroomMember>;
  private classroomSets: Map<number, ClassroomSet>;
  private quizzes: Map<number, Quiz>;
  private quizResults: Map<number, QuizResult>;
  private recentStudies: any[];
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private flashcardSetIdCounter: number;
  private flashcardIdCounter: number;
  private studyProgressIdCounter: number;
  private classroomIdCounter: number;
  private classroomMemberIdCounter: number;
  private classroomSetIdCounter: number;
  private quizIdCounter: number;
  private quizResultIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.flashcardSets = new Map();
    this.flashcards = new Map();
    this.studyProgresses = new Map();
    this.classrooms = new Map();
    this.classroomMembers = new Map();
    this.classroomSets = new Map();
    this.quizzes = new Map();
    this.quizResults = new Map();
    this.recentStudies = [];
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.flashcardSetIdCounter = 1;
    this.flashcardIdCounter = 1;
    this.studyProgressIdCounter = 1;
    this.classroomIdCounter = 1;
    this.classroomMemberIdCounter = 1;
    this.classroomSetIdCounter = 1;
    this.quizIdCounter = 1;
    this.quizResultIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoriesByUserId(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(category => category.userId === userId);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      id,
      createdAt: new Date()
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Flashcard set operations
  async getFlashcardSets(): Promise<FlashcardSet[]> {
    return Array.from(this.flashcardSets.values());
  }

  async getFlashcardSetsByUserId(userId: number): Promise<FlashcardSet[]> {
    return Array.from(this.flashcardSets.values()).filter(set => set.userId === userId);
  }

  async getFlashcardSetsByCategoryId(categoryId: number): Promise<FlashcardSet[]> {
    return Array.from(this.flashcardSets.values()).filter(set => set.categoryId === categoryId);
  }

  async getFlashcardSet(id: number): Promise<FlashcardSet | undefined> {
    return this.flashcardSets.get(id);
  }

  async createFlashcardSet(set: InsertFlashcardSet): Promise<FlashcardSet> {
    const id = this.flashcardSetIdCounter++;
    const newSet: FlashcardSet = {
      ...set,
      id,
      createdAt: new Date()
    };
    this.flashcardSets.set(id, newSet);
    return newSet;
  }

  async updateFlashcardSet(id: number, set: Partial<FlashcardSet>): Promise<FlashcardSet> {
    const existingSet = this.flashcardSets.get(id);
    if (!existingSet) {
      throw new Error(`Flashcard set with id ${id} not found`);
    }
    
    const updatedSet = { ...existingSet, ...set };
    this.flashcardSets.set(id, updatedSet);
    return updatedSet;
  }

  async deleteFlashcardSet(id: number): Promise<void> {
    // Delete associated flashcards first
    const cardsToDelete = Array.from(this.flashcards.values())
      .filter(card => card.setId === id)
      .map(card => card.id);
    
    for (const cardId of cardsToDelete) {
      await this.deleteFlashcard(cardId);
    }
    
    this.flashcardSets.delete(id);
  }

  // Flashcard operations
  async getFlashcardsBySetId(setId: number): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values()).filter(card => card.setId === setId);
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    return this.flashcards.get(id);
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.flashcardIdCounter++;
    const newFlashcard: Flashcard = {
      ...flashcard,
      id,
      createdAt: new Date()
    };
    this.flashcards.set(id, newFlashcard);
    return newFlashcard;
  }

  async updateFlashcard(id: number, flashcard: Partial<Flashcard>): Promise<Flashcard> {
    const existingFlashcard = this.flashcards.get(id);
    if (!existingFlashcard) {
      throw new Error(`Flashcard with id ${id} not found`);
    }
    
    const updatedFlashcard = { ...existingFlashcard, ...flashcard };
    this.flashcards.set(id, updatedFlashcard);
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    // Delete associated study progress first
    const progressesToDelete = Array.from(this.studyProgresses.values())
      .filter(progress => progress.flashcardId === id)
      .map(progress => progress.id);
    
    for (const progressId of progressesToDelete) {
      this.studyProgresses.delete(progressId);
    }
    
    this.flashcards.delete(id);
  }

  // Study progress operations
  async getStudyProgressByUserId(userId: number): Promise<StudyProgress[]> {
    return Array.from(this.studyProgresses.values()).filter(progress => progress.userId === userId);
  }

  async getStudyProgressByFlashcardId(flashcardId: number): Promise<StudyProgress | undefined> {
    return Array.from(this.studyProgresses.values()).find(progress => progress.flashcardId === flashcardId);
  }

  async createStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress> {
    const id = this.studyProgressIdCounter++;
    const newProgress: StudyProgress = {
      ...progress,
      id,
      lastStudied: new Date(),
      nextReview: new Date()
    };
    this.studyProgresses.set(id, newProgress);
    return newProgress;
  }

  async updateStudyProgress(id: number, progress: Partial<StudyProgress>): Promise<StudyProgress> {
    const existingProgress = this.studyProgresses.get(id);
    if (!existingProgress) {
      throw new Error(`Study progress with id ${id} not found`);
    }
    
    const updatedProgress = { ...existingProgress, ...progress };
    this.studyProgresses.set(id, updatedProgress);
    return updatedProgress;
  }

  // Classroom operations
  async getClassrooms(): Promise<Classroom[]> {
    return Array.from(this.classrooms.values());
  }

  async getClassroomsByUserId(userId: number): Promise<Classroom[]> {
    // Get classrooms where user is a member
    const memberClassroomIds = Array.from(this.classroomMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.classroomId);
    
    // Add classrooms where user is the owner
    const ownedClassrooms = Array.from(this.classrooms.values())
      .filter(classroom => classroom.ownerId === userId);
    
    // Get all member classrooms
    const memberClassrooms = Array.from(this.classrooms.values())
      .filter(classroom => memberClassroomIds.includes(classroom.id));
    
    // Combine and remove duplicates
    return [...ownedClassrooms, ...memberClassrooms].filter((classroom, index, self) =>
      index === self.findIndex(c => c.id === classroom.id)
    );
  }

  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const id = this.classroomIdCounter++;
    const newClassroom: Classroom = {
      ...classroom,
      id,
      createdAt: new Date()
    };
    this.classrooms.set(id, newClassroom);
    return newClassroom;
  }

  async getClassroomMembers(classroomId: number): Promise<ClassroomMember[]> {
    return Array.from(this.classroomMembers.values()).filter(member => member.classroomId === classroomId);
  }

  async addClassroomMember(member: InsertClassroomMember): Promise<ClassroomMember> {
    const id = this.classroomMemberIdCounter++;
    const newMember: ClassroomMember = {
      ...member,
      id,
      joinedAt: new Date()
    };
    this.classroomMembers.set(id, newMember);
    return newMember;
  }

  // Classroom sets operations
  async getClassroomSets(classroomId: number): Promise<ClassroomSet[]> {
    return Array.from(this.classroomSets.values()).filter(set => set.classroomId === classroomId);
  }

  async addClassroomSet(classroomSet: InsertClassroomSet): Promise<ClassroomSet> {
    const id = this.classroomSetIdCounter++;
    const newClassroomSet: ClassroomSet = {
      ...classroomSet,
      id,
      addedAt: new Date()
    };
    this.classroomSets.set(id, newClassroomSet);
    return newClassroomSet;
  }

  // Quiz operations
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.quizIdCounter++;
    const newQuiz: Quiz = {
      ...quiz,
      id,
      createdAt: new Date()
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  async getQuizzesByUserId(userId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.userId === userId);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  // Quiz results operations
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.quizResultIdCounter++;
    const newResult: QuizResult = {
      ...result,
      id,
      completedAt: new Date()
    };
    this.quizResults.set(id, newResult);
    return newResult;
  }

  async getQuizResultsByUserId(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(result => result.userId === userId);
  }

  // Recent studies operations
  async getRecentStudies(): Promise<any[]> {
    return this.recentStudies;
  }

  async addRecentStudy(study: { setId: number, progress: number, lastStudied: string }): Promise<void> {
    // Remove any existing study for this set
    this.recentStudies = this.recentStudies.filter(s => s.setId !== study.setId);
    
    // Add the new study and limit to 5 most recent
    this.recentStudies.unshift(study);
    this.recentStudies = this.recentStudies.slice(0, 5);
  }
}

export const storage = new MemStorage();
