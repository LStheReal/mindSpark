import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, Share2, Play } from "lucide-react";
import type { FlashcardSet } from "@shared/schema";

interface FlashcardSetCardProps {
  set: FlashcardSet;
  cardCount: number;
  progress?: number;
  lastStudied?: string;
}

export default function FlashcardSetCard({ set, cardCount, progress, lastStudied }: FlashcardSetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isHovered ? 'card-shadow-hover' : 'card-shadow'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-3" style={{ backgroundColor: set.color }}></div>
      <div className="p-5">
        <h4 className="font-bold mb-1">{set.title}</h4>
        <p className="text-sm text-[#4B5563] mb-3">{cardCount} cards {progress !== undefined && `• ${progress}% mastered`}</p>
        
        {progress !== undefined && (
          <div className="w-full mb-3">
            <Progress value={progress} className="h-2.5" />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {lastStudied ? `Last studied: ${lastStudied}` : `Created: ${new Date(set.createdAt || '').toLocaleDateString()}`}
          </span>
          
          {progress !== undefined ? (
            <Link href={`/study/${set.id}`}>
              <Button size="icon" variant="ghost" className="text-[#3B82F6] hover:text-[#1E40AF] transition-colors">
                <Play className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex space-x-2">
              <Link href={`/edit-set/${set.id}`}>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-[#3B82F6] transition-colors">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-[#3B82F6] transition-colors">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
