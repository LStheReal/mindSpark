import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIGenerationForm from "@/components/ai/AIGenerationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";

export default function AIGenerator() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("text");
  
  // Fetch flashcard sets for quiz generation
  const { data: flashcardSets, isLoading: setsLoading } = useQuery({
    queryKey: ["/api/flashcard-sets"],
    enabled: isAuthenticated,
  });
  
  const handleFormSuccess = (data: any) => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ["/api/flashcard-sets"] });
    
    if (activeTab === "text") {
      // Navigate to the newly created set
      navigate(`/flashcard-set/${data.id}`);
    } else {
      // Navigate to the quiz
      navigate(`/quiz/${data.id}`);
    }
  };
  
  if (!isAuthenticated && !authLoading) {
    window.location.href = "/api/login";
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 text-[#4B5563] hover:text-[#3B82F6]"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-md p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-[#8B5CF6]" />
                <h1 className="text-2xl font-bold">AI-Powered Learning Tools</h1>
              </div>
              <p className="text-[#4B5563]">
                Let artificial intelligence do the heavy lifting. Generate flashcards, quizzes, and study materials instantly using state-of-the-art AI.
              </p>
            </Card>
            
            <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text">Generate Flashcards</TabsTrigger>
                <TabsTrigger value="quiz">Generate Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <AIGenerationForm
                  type="text"
                  onSuccess={handleFormSuccess}
                />
              </TabsContent>
              
              <TabsContent value="quiz">
                {!setsLoading && flashcardSets && (
                  <AIGenerationForm
                    type="quiz"
                    flashcardSets={flashcardSets.map((set: any) => ({
                      id: set.id,
                      title: set.title,
                      cardCount: set.cardCount,
                    }))}
                    onSuccess={handleFormSuccess}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
