import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/home/FeatureCard";
import TestimonialCard from "@/components/home/TestimonialCard";
import { Wand2, Brain, Users, ChevronRight, Play } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [demoCardFlipped, setDemoCardFlipped] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Learn Faster, <br/>Study Smarter</h1>
              <p className="text-lg mb-6 max-w-lg">Create, study, and share flashcards and quizzes—all supercharged with artificial intelligence.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="px-6 py-3 bg-white text-[#3B82F6] font-bold rounded-lg hover:bg-gray-100 transition-colors">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="px-6 py-3 bg-white text-[#3B82F6] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Get Started
                  </Button>
                )}
                <Link href="#features">
                  <Button variant="outline" className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors">
                    See how it works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=450" 
                alt="Student studying with MindSpark" 
                className="rounded-xl shadow-lg max-w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Overview */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">AI-Enhanced Learning Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Wand2}
              title="AI-Powered Creation"
              description="Upload images, paste text, or upload PDFs to automatically generate high-quality flashcards."
              iconColor="#3B82F6"
            />
            
            <FeatureCard 
              icon={Brain}
              title="Smart Review"
              description="Our spaced repetition system adapts to your learning behavior, prioritizing difficult cards."
              iconColor="#8B5CF6"
            />
            
            <FeatureCard 
              icon={Users}
              title="Classrooms & Collaboration"
              description="Create or join classrooms, share flashcard sets, and study together with classmates."
              iconColor="#3B82F6"
            />
          </div>
        </div>
      </section>
      
      {/* Study Mode Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 font-poppins">Study Mode</h2>
          <p className="text-center text-[#4B5563] max-w-2xl mx-auto mb-12">Flip through your flashcards, mark what you know, and track your progress with our intelligent study system.</p>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 flex justify-center">
              {/* Flashcard Demo */}
              <div 
                className={`flip-card w-full max-w-md aspect-[4/3] ${demoCardFlipped ? 'flipped' : ''}`}
                onClick={() => setDemoCardFlipped(!demoCardFlipped)}
              >
                <div className="flip-card-inner relative w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front absolute w-full h-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-[#4B5563] mb-4 text-center">What is photosynthesis?</h3>
                    <p className="text-gray-500 text-center">Click to flip</p>
                  </div>
                  
                  {/* Back */}
                  <div className="flip-card-back absolute w-full h-full bg-[#3B82F6] text-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold mb-4 text-center">Photosynthesis</h3>
                    <p className="text-center">The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll, taking in carbon dioxide and releasing oxygen as a byproduct.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 font-poppins">Effective Learning Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="text-[#3B82F6] mr-3 mt-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Interactive Flashcards</h4>
                    <p className="text-[#4B5563]">Flip cards with smooth animations to test your knowledge on both sides.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="text-[#3B82F6] mr-3 mt-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Progress Tracking</h4>
                    <p className="text-[#4B5563]">Mark cards as "know" or "still learning" to personalize your study experience.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="text-[#3B82F6] mr-3 mt-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Smart Shuffling</h4>
                    <p className="text-[#4B5563]">Automatically focuses on cards you find most challenging based on your study history.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="text-[#3B82F6] mr-3 mt-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Study Anywhere</h4>
                    <p className="text-[#4B5563]">Fully responsive design works seamlessly on all your devices.</p>
                  </div>
                </li>
              </ul>
              
              <Link href={isAuthenticated ? "/study" : "/api/login"}>
                <Button className="mt-8 px-6 py-3 bg-[#3B82F6] text-white font-bold rounded-lg hover:bg-[#1E40AF] transition-colors">
                  <Play className="mr-2 h-4 w-4" /> Try Study Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              content="The AI flashcard generation saved me hours of work. I just uploaded my biology notes and got a perfectly organized set of cards to study from."
              name="Michael S."
              title="Pre-Med Student"
              avatarUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
              rating={5}
            />
            
            <TestimonialCard 
              content="As a teacher, MindSpark has revolutionized how I create study materials for my students. The classroom sharing feature makes distribution effortless."
              name="Jennifer L."
              title="High School Teacher"
              avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
              rating={5}
            />
            
            <TestimonialCard 
              content="The spaced repetition system helped me ace my Spanish exam. I love how it focuses on the words I struggle with most. Smart studying at its best!"
              name="David K."
              title="College Freshman"
              avatarUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
              rating={4.5}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-poppins">Ready to Spark Your Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who are studying smarter, not harder, with MindSpark's AI-powered learning tools.</p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="px-8 py-4 bg-white text-[#3B82F6] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Button 
              className="px-8 py-4 bg-white text-[#3B82F6] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started Free
            </Button>
          )}
          <p className="mt-4 text-white/80">No credit card required. Free plan includes 50 AI-generated flashcards.</p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
