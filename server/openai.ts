// OpenAI integration for AI-powered features
import OpenAI from "openai";
import { Flashcard } from "@shared/schema";

// Initialize OpenAI with default API key
// This will be used as fallback when user doesn't have their own key
const defaultOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get OpenAI instance based on user's API key
function getOpenAIInstance(userApiKey?: string) {
  if (userApiKey) {
    return new OpenAI({
      apiKey: userApiKey,
    });
  }
  return defaultOpenAI;
};

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export async function generateFlashcardsFromText(
  content: string,
  subject: string
): Promise<{ question: string; answer: string }[]> {
  console.log(`Generating flashcards for subject: ${subject}`);
  
  try {
    const prompt = `
      I need to create educational flashcards based on the following ${subject} content:
      
      ${content.slice(0, 4000)} 
      
      Please create 10 high-quality flashcards in question and answer format. 
      Each flashcard should focus on an important concept from the material.
      Make the questions clear and concise. The answers should be comprehensive but not too long.
      
      Format your response as valid JSON with this structure:
      [
        {
          "question": "Question 1?",
          "answer": "Answer 1"
        },
        ...
      ]
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const generatedContent = response.choices[0].message.content;
    if (!generatedContent) {
      throw new Error("No content generated from OpenAI");
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(generatedContent);
    
    // Validate and extract the flashcards
    if (Array.isArray(parsedResponse.flashcards) || Array.isArray(parsedResponse)) {
      const flashcardsArray = Array.isArray(parsedResponse.flashcards) 
        ? parsedResponse.flashcards 
        : parsedResponse;
        
      return flashcardsArray.slice(0, 10).map((card: { question: string; answer: string }) => ({
        question: card.question,
        answer: card.answer
      }));
    }
    
    throw new Error("Invalid response format from OpenAI");
  } catch (error) {
    console.error("Error generating flashcards with OpenAI:", error);
    
    // Fallback to simulated flashcards
    return simulateFlashcardGeneration(content, subject);
  }
}

export async function generateQuizFromFlashcards(
  flashcards: Flashcard[],
  quizType: string,
  questionCount: number
): Promise<any[]> {
  console.log(`Generating ${quizType} quiz with ${questionCount} questions`);
  
  try {
    // Format the flashcards for the prompt
    const flashcardsText = flashcards
      .map((card, index) => `${index + 1}. Q: ${card.question}\n   A: ${card.answer}`)
      .join('\n\n');
    
    const prompt = `
      Create a ${quizType} quiz based on these flashcards:
      
      ${flashcardsText}
      
      Quiz type: ${quizType} (${quizType === "multiple_choice" ? "multiple-choice questions" : 
                              quizType === "fill_blank" ? "fill-in-the-blank questions" : 
                              quizType === "matching" ? "matching items" : 
                              "mixed format with various question types"})
      
      Number of questions: ${questionCount}
      
      Format your response as valid JSON with this structure:
      For multiple choice: 
      {
        "questions": [
          {
            "type": "multiple_choice",
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0
          }
        ]
      }
      
      For fill in the blank:
      {
        "questions": [
          {
            "type": "fill_blank",
            "question": "Complete this sentence: _________ is the capital of France",
            "answer": "Paris"
          }
        ]
      }
      
      For matching:
      {
        "questions": [
          {
            "type": "matching",
            "question": "Match the items from column A with column B",
            "items": [
              {"prompt": "Item A", "match": "Answer 1"},
              {"prompt": "Item B", "match": "Answer 2"}
            ]
          }
        ]
      }
      
      For mixed format, include a combination of the above types.
      Ensure the quiz covers the most important concepts from the flashcards.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const generatedContent = response.choices[0].message.content;
    if (!generatedContent) {
      throw new Error("No content generated from OpenAI");
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(generatedContent);
    
    // Extract and return the quiz questions
    if (Array.isArray(parsedResponse.questions) || Array.isArray(parsedResponse)) {
      const questionsArray = Array.isArray(parsedResponse.questions) 
        ? parsedResponse.questions 
        : parsedResponse;
        
      return questionsArray.slice(0, questionCount);
    }
    
    throw new Error("Invalid response format from OpenAI");
  } catch (error) {
    console.error("Error generating quiz with OpenAI:", error);
    
    // Fallback to simulated quiz generation
    return simulateQuizGeneration(flashcards, quizType, questionCount);
  }
}

// Fallback function for flashcards generation
function simulateFlashcardGeneration(
  content: string,
  subject: string
): { question: string; answer: string }[] {
  // Extract paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 15);
  
  // Generate flashcards based on the content
  const flashcards = [];
  
  // Create some simulated flashcards based on the subject and content
  if (subject.toLowerCase().includes("biology")) {
    flashcards.push(
      {
        question: "What is photosynthesis?",
        answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll, converting carbon dioxide and water into glucose and oxygen."
      },
      {
        question: "What are the main components of a cell?",
        answer: "The main components of a cell include the cell membrane, nucleus, cytoplasm, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and ribosomes."
      }
    );
    
    // Add more subject-specific cards
    if (content.toLowerCase().includes("dna")) {
      flashcards.push({
        question: "What is DNA?",
        answer: "DNA (deoxyribonucleic acid) is a molecule that carries genetic information and instructions for development, functioning, growth, and reproduction."
      });
    }
    
    if (content.toLowerCase().includes("protein")) {
      flashcards.push({
        question: "What is protein synthesis?",
        answer: "Protein synthesis is the process by which cells build proteins. It involves transcription (DNA to mRNA) and translation (mRNA to protein)."
      });
    }
  } else if (subject.toLowerCase().includes("history")) {
    flashcards.push(
      {
        question: "When did World War II begin?",
        answer: "World War II began in Europe on September 1, 1939, when Nazi Germany invaded Poland."
      },
      {
        question: "Who was the first President of the United States?",
        answer: "George Washington was the first President of the United States, serving from 1789 to 1797."
      }
    );
    
    // Add more subject-specific cards
    if (content.toLowerCase().includes("revolution")) {
      flashcards.push({
        question: "What was the Industrial Revolution?",
        answer: "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s, beginning in Great Britain and later spreading to other countries."
      });
    }
    
    if (content.toLowerCase().includes("civil war")) {
      flashcards.push({
        question: "When was the American Civil War fought?",
        answer: "The American Civil War was fought from 1861 to 1865 between the Northern states (Union) and the Southern states (Confederacy)."
      });
    }
  } else if (subject.toLowerCase().includes("math")) {
    flashcards.push(
      {
        question: "What is the Pythagorean theorem?",
        answer: "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (a² + b² = c²)."
      },
      {
        question: "What is the derivative of f(x) = x²?",
        answer: "The derivative of f(x) = x² is f'(x) = 2x."
      }
    );
    
    // Add more subject-specific cards
    if (content.toLowerCase().includes("calculus")) {
      flashcards.push({
        question: "What is integration in calculus?",
        answer: "Integration is the process of finding the integral of a function. It is the reverse of differentiation and can be used to find areas, volumes, and other quantities."
      });
    }
    
    if (content.toLowerCase().includes("algebra")) {
      flashcards.push({
        question: "What is a quadratic equation?",
        answer: "A quadratic equation is a second-degree polynomial equation of the form ax² + bx + c = 0, where a ≠ 0."
      });
    }
  } else {
    // Generic flashcards based on the content
    const contentWords = content.split(/\s+/).filter(word => word.length > 5);
    // Use Array.from instead of the spread operator for better compatibility
    const uniqueWords = Array.from(new Set(contentWords));
    
    // Create flashcards from paragraphs
    for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
      const paragraph = paragraphs[i];
      const firstSentence = paragraph.split(/\.\s+/)[0];
      
      if (firstSentence.length > 10) {
        const question = `What is the significance of: "${firstSentence.substring(0, 50)}..."?`;
        const answer = paragraph.length > 150 ? paragraph.substring(0, 150) + "..." : paragraph;
        
        flashcards.push({
          question,
          answer
        });
      }
    }
    
    // If we still need more cards, generate some based on unique words
    if (flashcards.length < 3 && uniqueWords.length > 0) {
      for (let i = 0; i < Math.min(uniqueWords.length, 3); i++) {
        const word = uniqueWords[i];
        flashcards.push({
          question: `Define or explain the term "${word}" in the context of ${subject}.`,
          answer: `This term appears in the provided content about ${subject}. In a production environment, AI would generate a detailed explanation.`
        });
      }
    }
  }
  
  // Add a few more generic cards based on the content length
  if (content.length > 500) {
    flashcards.push({
      question: `Summarize the key points about ${subject}.`,
      answer: `The material covers important concepts in ${subject}. In a production environment, AI would generate a detailed summary.`
    });
  }
  
  // Ensure we have at least 5 flashcards
  while (flashcards.length < 5) {
    flashcards.push({
      question: `Important concept in ${subject} #${flashcards.length + 1}`,
      answer: `This is a placeholder. In a production environment, AI would generate more flashcards based on the content.`
    });
  }
  
  // Return flashcards (maximum 10)
  return flashcards.slice(0, 10);
}

// Fallback function for quiz generation
function simulateQuizGeneration(
  flashcards: Flashcard[],
  quizType: string,
  questionCount: number
): any[] {
  const quiz = [];
  
  // Generate quiz questions based on the quiz type
  for (let i = 0; i < Math.min(flashcards.length, questionCount); i++) {
    const flashcard = flashcards[i];
    
    if (quizType === "multiple_choice") {
      // Generate a multiple choice question
      const correct = flashcard.answer;
      
      // Create distractors (wrong answers)
      const distractors = flashcards
        .filter(f => f.id !== flashcard.id)
        .map(f => f.answer)
        .slice(0, 3);
      
      // Ensure we have enough options
      while (distractors.length < 3) {
        distractors.push(`Incorrect answer option ${distractors.length + 1}`);
      }
      
      // Shuffle options
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
      
      quiz.push({
        type: "multiple_choice",
        question: flashcard.question,
        options,
        correctIndex: options.indexOf(correct)
      });
    } else if (quizType === "fill_blank") {
      // Generate a fill-in-the-blank question
      const answer = flashcard.answer;
      
      // Create a blank by finding a significant word
      const words = answer.split(/\s+/);
      let blankWord = "";
      
      // Try to find a word with at least 5 characters
      for (const word of words) {
        if (word.length >= 5 && !word.match(/^[.,;:!?'")\]]/)) {
          blankWord = word;
          break;
        }
      }
      
      // If no good word was found, use the first word
      if (!blankWord && words.length > 0) {
        blankWord = words[0];
      }
      
      // Create question with blank
      const questionWithBlank = answer.replace(blankWord, "_______");
      
      quiz.push({
        type: "fill_blank",
        question: `${flashcard.question} - Complete the following: ${questionWithBlank}`,
        answer: blankWord
      });
    } else if (quizType === "matching") {
      // For matching questions, we'll need to collect all items first
      // and then create the matching quiz at the end
      continue;
    } else if (quizType === "mixed") {
      // For mixed quiz, alternate between multiple choice and fill-in-the-blank
      if (i % 2 === 0) {
        // Multiple choice
        const correct = flashcard.answer;
        const distractors = flashcards
          .filter(f => f.id !== flashcard.id)
          .map(f => f.answer)
          .slice(0, 3);
        
        while (distractors.length < 3) {
          distractors.push(`Incorrect answer option ${distractors.length + 1}`);
        }
        
        const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
        
        quiz.push({
          type: "multiple_choice",
          question: flashcard.question,
          options,
          correctIndex: options.indexOf(correct)
        });
      } else {
        // Fill-in-the-blank
        const answer = flashcard.answer;
        const words = answer.split(/\s+/);
        let blankWord = "";
        
        for (const word of words) {
          if (word.length >= 5 && !word.match(/^[.,;:!?'")\]]/)) {
            blankWord = word;
            break;
          }
        }
        
        if (!blankWord && words.length > 0) {
          blankWord = words[0];
        }
        
        const questionWithBlank = answer.replace(blankWord, "_______");
        
        quiz.push({
          type: "fill_blank",
          question: `${flashcard.question} - Complete the following: ${questionWithBlank}`,
          answer: blankWord
        });
      }
    }
  }
  
  // Add matching questions if needed
  if (quizType === "matching") {
    // Use up to 5 flashcards for matching
    const matchingFlashcards = flashcards.slice(0, Math.min(5, flashcards.length));
    
    const items = matchingFlashcards.map(f => ({
      prompt: f.question,
      match: f.answer
    }));
    
    // Create a matching question with all items
    quiz.push({
      type: "matching",
      question: "Match each question with its correct answer:",
      items: items
    });
  }
  
  return quiz;
}
