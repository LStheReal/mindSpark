import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFlashcardsFromText, generateQuizFromFlashcards } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.get("/api/auth/user", async (req, res) => {
    // This would normally check the session and return the user
    // For now, we'll return a mock user since we're using memory storage
    try {
      // Check if we have a test user, otherwise create one
      let user = await storage.getUserByUsername("testuser");
      
      if (!user) {
        user = await storage.createUser({
          username: "testuser",
          password: "password123", // In a real app, this would be hashed
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
        });
        
        // Create some sample categories
        await storage.createCategory({
          name: "Biology",
          userId: user.id,
          color: "#3B82F6"
        });
        
        await storage.createCategory({
          name: "History",
          userId: user.id,
          color: "#8B5CF6"
        });
        
        await storage.createCategory({
          name: "Mathematics",
          userId: user.id,
          color: "#10B981"
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Flashcard set routes
  app.get("/api/flashcard-sets", async (req, res) => {
    try {
      const sets = await storage.getFlashcardSets();
      
      // For each set, get the card count
      const setsWithCardCount = await Promise.all(
        sets.map(async (set) => {
          const cards = await storage.getFlashcardsBySetId(set.id);
          return {
            ...set,
            cardCount: cards.length
          };
        })
      );
      
      res.json(setsWithCardCount);
    } catch (error) {
      console.error("Error fetching flashcard sets:", error);
      res.status(500).json({ message: "Failed to fetch flashcard sets" });
    }
  });

  app.get("/api/flashcard-sets/:id", async (req, res) => {
    try {
      const set = await storage.getFlashcardSet(parseInt(req.params.id));
      
      if (!set) {
        return res.status(404).json({ message: "Flashcard set not found" });
      }
      
      const cards = await storage.getFlashcardsBySetId(set.id);
      
      res.json({
        ...set,
        cardCount: cards.length
      });
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      res.status(500).json({ message: "Failed to fetch flashcard set" });
    }
  });

  app.post("/api/flashcard-sets", async (req, res) => {
    try {
      const { title, description, userId, categoryId, color, flashcards } = req.body;
      
      // Create the flashcard set
      const set = await storage.createFlashcardSet({
        title,
        description,
        userId,
        categoryId,
        color: color || "#3B82F6",
        isPublic: false
      });
      
      // Create the flashcards
      const createdFlashcards = await Promise.all(
        flashcards.map((card: any) =>
          storage.createFlashcard({
            question: card.question,
            answer: card.answer,
            setId: set.id,
            imageUrl: card.imageUrl
          })
        )
      );
      
      res.status(201).json({
        ...set,
        flashcards: createdFlashcards,
        cardCount: createdFlashcards.length
      });
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      res.status(500).json({ message: "Failed to create flashcard set" });
    }
  });

  app.get("/api/flashcard-sets/:id/flashcards", async (req, res) => {
    try {
      const cards = await storage.getFlashcardsBySetId(parseInt(req.params.id));
      res.json(cards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Classroom routes
  app.get("/api/classrooms", async (req, res) => {
    try {
      const classrooms = await storage.getClassrooms();
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  // Recent studies
  app.get("/api/recent-studies", async (req, res) => {
    try {
      const studies = await storage.getRecentStudies();
      
      // For each study, get the associated set and card count
      const studiesWithDetails = await Promise.all(
        studies.map(async (study) => {
          const set = await storage.getFlashcardSet(study.setId);
          const cards = await storage.getFlashcardsBySetId(study.setId);
          
          return {
            ...set,
            cardCount: cards.length,
            progress: study.progress,
            lastStudied: study.lastStudied
          };
        })
      );
      
      res.json(studiesWithDetails);
    } catch (error) {
      console.error("Error fetching recent studies:", error);
      res.status(500).json({ message: "Failed to fetch recent studies" });
    }
  });

  // Study progress
  app.post("/api/flashcard-sets/:id/progress", async (req, res) => {
    try {
      const setId = parseInt(req.params.id);
      const { knownCards, unknownCards } = req.body;
      
      // Update study progress
      // In a real app, we would store detailed progress for each card
      
      // For now, we'll just add this to recent studies with a progress percentage
      const totalCards = knownCards.length + unknownCards.length;
      const progressPercentage = totalCards > 0 ? Math.round((knownCards.length / totalCards) * 100) : 0;
      
      await storage.addRecentStudy({
        setId,
        progress: progressPercentage,
        lastStudied: new Date().toISOString()
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating study progress:", error);
      res.status(500).json({ message: "Failed to update study progress" });
    }
  });

  // AI Routes
  app.post("/api/ai/generate-flashcards", async (req, res) => {
    try {
      const { content, subject, userId } = req.body;
      
      // Get user (in a real app, this would be the authenticated user)
      const user = userId ? await storage.getUser(userId) : await storage.getUserByUsername("testuser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we would retrieve the user's API key from a secure storage
      // For this simulation, we'll check if they have a stored API key preference
      // We would use the value securely stored in the database
      
      // This would be a call to retrieve API settings for user in a real app
      // const apiSettings = await storage.getUserApiSettings(user.id);
      // const userApiKey = apiSettings?.useOwnApi ? apiSettings.apiKey : undefined;
      
      // For now, there's no implementation for storing API keys, so we'll use the default
      const userApiKey = undefined;
      
      // Generate flashcards using OpenAI
      const generatedCards = await generateFlashcardsFromText(content, subject, userApiKey);
      
      // Create a flashcard set
      const set = await storage.createFlashcardSet({
        title: `${subject} (AI Generated)`,
        description: `Automatically generated from text using AI`,
        userId: user.id,
        isPublic: false,
        color: "#8B5CF6" // Violet for AI-generated sets
      });
      
      // Create the flashcards
      const flashcards = await Promise.all(
        generatedCards.map((card) =>
          storage.createFlashcard({
            question: card.question,
            answer: card.answer,
            setId: set.id
          })
        )
      );
      
      res.status(201).json({
        ...set,
        flashcards,
        cardCount: flashcards.length
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ message: "Failed to generate flashcards" });
    }
  });

  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { setId, quizType, questionCount, userId } = req.body;
      
      // Get user
      const user = userId ? await storage.getUser(userId) : await storage.getUserByUsername("testuser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the flashcard set
      const set = await storage.getFlashcardSet(parseInt(setId));
      
      if (!set) {
        return res.status(404).json({ message: "Flashcard set not found" });
      }
      
      // Get the flashcards
      const flashcards = await storage.getFlashcardsBySetId(parseInt(setId));
      
      // In a real app, we would retrieve the user's API key from a secure storage
      // For this simulation, we'll check if they have a stored API key preference
      // We would use the value securely stored in the database
      
      // This would be a call to retrieve API settings for user in a real app
      // const apiSettings = await storage.getUserApiSettings(user.id);
      // const userApiKey = apiSettings?.useOwnApi ? apiSettings.apiKey : undefined;
      
      // For now, there's no implementation for storing API keys, so we'll use the default
      const userApiKey = undefined;
      
      // Generate quiz using OpenAI
      const quiz = await generateQuizFromFlashcards(
        flashcards, 
        quizType, 
        Math.min(questionCount, flashcards.length),
        userApiKey
      );
      
      // Create the quiz
      const createdQuiz = await storage.createQuiz({
        title: `${set.title} Quiz (${quizType})`,
        setId: parseInt(setId),
        userId: user.id,
        quizType,
        questions: quiz
      });
      
      res.status(201).json(createdQuiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });
  
  // Settings routes
  app.post("/api/settings/api-key", async (req, res) => {
    try {
      const { userId, apiKey, useOwnApi } = req.body;
      
      // Get the user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we would encrypt the API key before storing it
      // Here we'll simulate storing it in user settings
      // This would need a proper user settings table in a real app
      
      // For now, we'll just acknowledge receipt of the settings
      res.json({ 
        success: true, 
        message: "API key settings saved",
        useOwnApi,
        // Don't send the actual API key back to the client for security
        hasApiKey: !!apiKey
      });
      
    } catch (error) {
      console.error("Error saving API key settings:", error);
      res.status(500).json({ message: "Failed to save API key settings" });
    }
  });
  
  // Get user API settings
  app.get("/api/settings/api-key/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get the user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we would retrieve this from the database
      // For this simulation, we'll just respond with default settings
      
      res.json({
        useOwnApi: false,
        // We never send the actual API key back for security reasons
        hasApiKey: false
      });
      
    } catch (error) {
      console.error("Error fetching API key settings:", error);
      res.status(500).json({ message: "Failed to fetch API key settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
