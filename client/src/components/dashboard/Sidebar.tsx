import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FolderIcon, StarIcon, HistoryIcon, UsersIcon, PlusIcon, LayoutGridIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
}

interface SidebarProps {
  categories: Category[];
  classrooms: Classroom[];
}

export default function Sidebar({ categories, classrooms }: SidebarProps) {
  const [location] = useLocation();
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4 font-poppins">My Library</h3>
      <ul className="space-y-3">
        <li>
          <Link href="/dashboard">
            <a className={`flex items-center ${location === '/dashboard' ? 'text-[#3B82F6]' : 'text-[#4B5563] hover:text-[#3B82F6]'} transition-colors font-medium`}>
              <LayoutGridIcon className="mr-3 h-4 w-4" />
              All Flashcards
            </a>
          </Link>
        </li>
        <li>
          <Link href="/favorites">
            <a className={`flex items-center ${location === '/favorites' ? 'text-[#3B82F6]' : 'text-[#4B5563] hover:text-[#3B82F6]'} transition-colors`}>
              <StarIcon className="mr-3 h-4 w-4" />
              Favorites
            </a>
          </Link>
        </li>
        <li>
          <Link href="/recent">
            <a className={`flex items-center ${location === '/recent' ? 'text-[#3B82F6]' : 'text-[#4B5563] hover:text-[#3B82F6]'} transition-colors`}>
              <HistoryIcon className="mr-3 h-4 w-4" />
              Recent
            </a>
          </Link>
        </li>
        
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/category/${category.id}`}>
              <a className={`flex items-center ${location === `/category/${category.id}` ? 'text-[#3B82F6]' : 'text-[#4B5563] hover:text-[#3B82F6]'} transition-colors`}>
                <FolderIcon className="mr-3 h-4 w-4" />
                {category.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      
      {classrooms.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 font-poppins">My Classrooms</h3>
          <ul className="space-y-3">
            {classrooms.map((classroom) => (
              <li key={classroom.id}>
                <Link href={`/classroom/${classroom.id}`}>
                  <a className={`flex items-center ${location === `/classroom/${classroom.id}` ? 'text-[#3B82F6]' : 'text-[#4B5563] hover:text-[#3B82F6]'} transition-colors`}>
                    <UsersIcon className="mr-3 h-4 w-4" />
                    {classroom.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <Link href="/create-flashcard">
        <Button className="mt-8 w-full px-4 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Set
        </Button>
      </Link>
    </div>
  );
}
