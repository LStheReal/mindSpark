import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { FlashcardSet } from "@shared/schema";

interface SpacedRepetitionSchedulerProps {
  flashcardSet: FlashcardSet;
  knownCards: number;
  unknownCards: number;
  onScheduleNext: (date: Date) => void;
}

/**
 * This component handles the scheduling of spaced repetition study sessions
 * It suggests optimal review dates based on the SM-2 algorithm
 */
export default function SpacedRepetitionScheduler({
  flashcardSet,
  knownCards,
  unknownCards,
  onScheduleNext,
}: SpacedRepetitionSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(getSuggestedDate());
  const [showScheduler, setShowScheduler] = useState(false);

  // Calculate performance score (0.0 - 1.0)
  const totalCards = knownCards + unknownCards;
  const performanceScore = totalCards > 0 ? knownCards / totalCards : 0;

  // Get suggested date for next review based on performance
  function getSuggestedDate(): Date {
    // SM-2 algorithm simplified:
    // 1. If performance < 0.6 (less than 60% known), review tomorrow
    // 2. If performance 0.6-0.8, review in 3 days
    // 3. If performance > 0.8, review in 7 days
    const today = new Date();
    
    let daysToAdd = 1;
    if (performanceScore >= 0.8) {
      daysToAdd = 7;
    } else if (performanceScore >= 0.6) {
      daysToAdd = 3;
    }
    
    const suggestedDate = new Date(today);
    suggestedDate.setDate(today.getDate() + daysToAdd);
    return suggestedDate;
  }

  function handleSchedule() {
    if (date) {
      onScheduleNext(date);
      setShowScheduler(false);
    }
  }

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Spaced Repetition</h3>
      <p className="text-[#4B5563] mb-4">
        Based on your performance ({Math.round(performanceScore * 100)}% cards known),
        we recommend reviewing this set again on:
      </p>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="text-lg font-medium">
          {date ? format(date, "MMMM d, yyyy") : "Select a date"}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-dashed border-[#E5E7EB]"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Change Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        className="w-full bg-[#3B82F6] hover:bg-[#1E40AF]"
        onClick={handleSchedule}
      >
        Schedule Next Study Session
      </Button>
    </Card>
  );
}