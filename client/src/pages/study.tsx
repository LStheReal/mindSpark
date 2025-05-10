import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Flashcard from "@/components/study/Flashcard";
import SpacedRepetitionScheduler from "@/components/study/SpacedRepetitionScheduler";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Shuffle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { type Flashcard as FlashcardType } from "@shared/schema";

export default function Study() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<FlashcardType[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Fetch flashcard set details
  const { data: flashcardSet, isLoading: setLoading } = useQuery<any>({
    queryKey: [`/api/flashcard-sets/${params.id}`],
    enabled: !!params.id && isAuthenticated,
  });
  
  // Fetch flashcards for the set
  const { data: flashcards, isLoading: cardsLoading } = useQuery<FlashcardType[]>({
    queryKey: [`/api/flashcard-sets/${params.id}/flashcards`],
    enabled: !!params.id && isAuthenticated,
  });
  
  const isLoading = authLoading || setLoading || cardsLoading;
  
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      shuffleCards();
    }
  }, [flashcards]);
  
  const shuffleCards = () => {
    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) return;
    
    // Create a copy of the flashcards array and shuffle it
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setKnownCards([]);
    setUnknownCards([]);
    setSessionCompleted(false);
    
    toast({
      title: "Cards shuffled",
      description: "Your flashcards have been shuffled randomly",
    });
  };
  
  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of deck reached
      setSessionCompleted(true);
      
      toast({
        title: "Study session completed!",
        description: `You've gone through all cards! Known: ${knownCards.length}, Still learning: ${unknownCards.length}`,
      });
      
      // Update study progress on the server
      updateStudyProgress();
    }
  };
  
  const handleMarkKnown = (id: number) => {
    setKnownCards([...knownCards, id]);
  };
  
  const handleMarkUnknown = (id: number) => {
    setUnknownCards([...unknownCards, id]);
  };
  
  const updateStudyProgress = async () => {
    if (!isAuthenticated) return;
    
    try {
      await apiRequest("POST", `/api/flashcard-sets/${params.id}/progress`, {
        knownCards,
        unknownCards,
      });
    } catch (error) {
      console.error("Failed to update study progress:", error);
    }
  };
  
  const handleScheduleNext = async (date: Date) => {
    try {
      await apiRequest("POST", `/api/flashcard-sets/${params.id}/schedule`, {
        nextReviewDate: date.toISOString(),
      });
      
      toast({
        title: "Next study session scheduled!",
        description: "Your next study session has been scheduled successfully.",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to schedule next study session:", error);
      toast({
        title: "Failed to schedule",
        description: "There was an error scheduling your next study session.",
        variant: "destructive",
      });
    }
  };
  
  if (!isAuthenticated && !authLoading) {
    window.location.href = "/api/login";
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!flashcardSet || !flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 bg-[#F9FAFB]">
          <div className="container mx-auto px-4 max-w-3xl">
            <Button
              variant="ghost"
              className="mb-6 text-[#4B5563] hover:text-[#3B82F6]"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
            
            <Card className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">No flashcards found</h1>
              <p className="mb-6 text-[#4B5563]">This flashcard set is empty or not available.</p>
              <Button
                className="bg-[#3B82F6] text-white hover:bg-[#1E40AF]"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const progress = Math.round(((currentIndex + 1) / shuffledCards.length) * 100);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-[#4B5563] hover:text-[#3B82F6]"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              className="text-[#4B5563]"
              onClick={shuffleCards}
              disabled={sessionCompleted}
            >
              <Shuffle className="h-4 w-4 mr-1" /> Shuffle Cards
            </Button>
          </div>
          
          <Card className="bg-white shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">{flashcardSet?.title || "Study Session"}</h1>
            {flashcardSet?.description && (
              <p className="text-[#4B5563] mb-4">{flashcardSet.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-[#4B5563]">
              <span>Progress: {currentIndex + 1} of {shuffledCards.length} cards</span>
              <span>
                Known: {knownCards.length} | Still Learning: {unknownCards.length}
              </span>
            </div>
            
            <Progress value={progress} className="h-2 mt-2" />
          </Card>
          
          {sessionCompleted ? (
            <div>
              <Card className="p-6 mb-6 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Session Completed!</h2>
                  <p className="mb-4 text-[#4B5563]">
                    You've completed studying all {shuffledCards.length} cards in this set.
                  </p>
                  <div className="flex gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <span className="block text-3xl font-bold text-green-500">{knownCards.length}</span>
                      <span className="text-sm text-[#4B5563]">Known</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <span className="block text-3xl font-bold text-red-500">{unknownCards.length}</span>
                      <span className="text-sm text-[#4B5563]">Still Learning</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={shuffleCards}
                      className="text-[#4B5563]"
                    >
                      Study Again
                    </Button>
                    <Button
                      className="bg-[#3B82F6] hover:bg-[#1E40AF]"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </Card>
              
              <SpacedRepetitionScheduler
                flashcardSet={flashcardSet || { id: parseInt(params.id || '0'), title: "Study Session" } as any}
                knownCards={knownCards.length}
                unknownCards={unknownCards.length}
                onScheduleNext={handleScheduleNext}
              />
            </div>
          ) : (
            shuffledCards.length > 0 && (
              <Flashcard
                flashcard={shuffledCards[currentIndex]}
                onNext={handleNext}
                onMarkKnown={handleMarkKnown}
                onMarkUnknown={handleMarkUnknown}
              />
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
