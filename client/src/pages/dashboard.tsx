import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/dashboard/Sidebar";
import FlashcardSetCard from "@/components/dashboard/FlashcardSetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, SortAsc } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";
import type { FlashcardSet, Category, Classroom } from "@shared/schema";

interface FlashcardSetWithStats extends FlashcardSet {
  cardCount: number;
  progress?: number;
  lastStudied?: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch user's flashcard sets
  const { data: allSets, isLoading: setsLoading } = useQuery({
    queryKey: ["/api/flashcard-sets"],
    enabled: isAuthenticated,
  });
  
  // Fetch recent studies
  const { data: recentStudies, isLoading: studiesLoading } = useQuery({
    queryKey: ["/api/recent-studies"],
    enabled: isAuthenticated,
  });
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });
  
  // Fetch classrooms
  const { data: classrooms, isLoading: classroomsLoading } = useQuery({
    queryKey: ["/api/classrooms"],
    enabled: isAuthenticated,
  });
  
  const isLoading = authLoading || setsLoading || studiesLoading || categoriesLoading || classroomsLoading;
  
  // Filter sets based on search term
  const filteredSets = allSets?.filter((set: FlashcardSetWithStats) => 
    set.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  if (!isAuthenticated && !authLoading) {
    window.location.href = "/api/login";
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              {isLoading ? (
                <Card className="p-6 h-96 animate-pulse bg-white" />
              ) : (
                <Sidebar 
                  categories={categories || []} 
                  classrooms={classrooms || []} 
                />
              )}
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-poppins">My Flashcards</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search sets..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  </div>
                  <Button variant="ghost" size="icon" className="p-2 text-[#4B5563] hover:text-[#3B82F6] transition-colors">
                    <SortAsc className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Recently Studied */}
              {recentStudies && recentStudies.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-4 font-poppins">Recently Studied</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="h-48 animate-pulse bg-white" />
                      ))
                    ) : (
                      recentStudies.map((set: FlashcardSetWithStats) => (
                        <FlashcardSetCard 
                          key={set.id} 
                          set={set} 
                          cardCount={set.cardCount} 
                          progress={set.progress}
                          lastStudied={set.lastStudied} 
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {/* All Flashcard Sets */}
              <div>
                <h3 className="text-xl font-bold mb-4 font-poppins">All Flashcard Sets</h3>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <Card key={i} className="h-40 animate-pulse bg-white" />
                    ))}
                  </div>
                ) : filteredSets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSets.map((set: FlashcardSetWithStats) => (
                      <FlashcardSetCard 
                        key={set.id} 
                        set={set} 
                        cardCount={set.cardCount} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No flashcard sets found.</p>
                    <Link href="/create-flashcard">
                      <Button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
                        Create your first set
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
