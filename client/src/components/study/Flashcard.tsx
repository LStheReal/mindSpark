import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Flashcard as FlashcardType } from "@shared/schema";

interface FlashcardProps {
  flashcard: FlashcardType;
  onNext: () => void;
  onMarkKnown: (id: number) => void;
  onMarkUnknown: (id: number) => void;
}

export default function Flashcard({ flashcard, onNext, onMarkKnown, onMarkUnknown }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  useEffect(() => {
    setIsFlipped(false);
    setIsAnswered(false);
  }, [flashcard]);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleMarkKnown = () => {
    setIsAnswered(true);
    onMarkKnown(flashcard.id);
  };
  
  const handleMarkUnknown = () => {
    setIsAnswered(true);
    onMarkUnknown(flashcard.id);
  };
  
  const handleNext = () => {
    onNext();
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`flip-card w-full aspect-[4/3] ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleFlip}
      >
        <div className="flip-card-inner relative w-full h-full">
          {/* Front */}
          <div className="flip-card-front absolute w-full h-full">
            <Card className="w-full h-full flex flex-col items-center justify-center p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#4B5563] mb-4 text-center">{flashcard.question}</h3>
              <p className="text-gray-500 text-center">Click to flip</p>
            </Card>
          </div>
          
          {/* Back */}
          <div className="flip-card-back absolute w-full h-full">
            <Card className="w-full h-full flex flex-col items-center justify-center p-8 shadow-lg bg-[#3B82F6] text-white">
              <h3 className="text-xl font-bold mb-4 text-center">{flashcard.question}</h3>
              <p className="text-center">{flashcard.answer}</p>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6 gap-4">
        {isFlipped && !isAnswered ? (
          <>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleMarkUnknown}
              className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <ThumbsDown className="mr-2 h-5 w-5" />
              Still Learning
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleMarkKnown}
              className="px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <ThumbsUp className="mr-2 h-5 w-5" />
              Got It!
            </Button>
          </>
        ) : isAnswered ? (
          <Button 
            size="lg" 
            onClick={handleNext}
            className="px-10 py-3 bg-[#3B82F6] hover:bg-[#1E40AF]"
          >
            Next Card
          </Button>
        ) : null}
      </div>
    </div>
  );
}
