import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-white header-shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center">
              <div className="text-3xl font-bold">
                <i className="fas fa-bolt text-[#FAFF00] mr-1"></i>
                <span className="gradient-text">MindSpark</span>
              </div>
            </a>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`${location === '/' ? 'text-[#3B82F6]' : 'text-[#4B5563]'} hover:text-[#3B82F6] transition-colors font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/dashboard">
            <a className={`${location === '/dashboard' ? 'text-[#3B82F6]' : 'text-[#4B5563]'} hover:text-[#3B82F6] transition-colors font-medium`}>
              My Library
            </a>
          </Link>
          <Link href="/classrooms">
            <a className={`${location === '/classrooms' ? 'text-[#3B82F6]' : 'text-[#4B5563]'} hover:text-[#3B82F6] transition-colors font-medium`}>
              Classrooms
            </a>
          </Link>
          <Link href="/explore">
            <a className={`${location === '/explore' ? 'text-[#3B82F6]' : 'text-[#4B5563]'} hover:text-[#3B82F6] transition-colors font-medium`}>
              Explore
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-4 py-2 rounded-lg bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200 transition-colors">
            <i className="fas fa-search mr-2"></i>
            Search
          </button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profileImage || ""} alt="Profile" />
                    <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">
                    <a className="w-full">Profile</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">
                    <a className="w-full">Settings</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="/api/logout" className="w-full">Log Out</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="px-4 py-2 text-[#3B82F6]"
              onClick={() => window.location.href = "/api/login"}
            >
              Log In
            </Button>
          )}
          
          <button className="md:hidden text-[#4B5563]">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
