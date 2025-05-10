import { Card } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  content: string;
  name: string;
  title: string;
  avatarUrl?: string;
  rating: number;
}

export default function TestimonialCard({ content, name, title, avatarUrl, rating }: TestimonialCardProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={18} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={18} />);
    }
    
    return stars;
  };
  
  return (
    <Card className="bg-[#F9FAFB] rounded-xl p-6 shadow-md">
      <div className="flex items-center mb-4">
        <div className="text-yellow-400 flex">
          {renderStars()}
        </div>
      </div>
      <p className="text-[#4B5563] mb-4">{content}</p>
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </Card>
  );
}
