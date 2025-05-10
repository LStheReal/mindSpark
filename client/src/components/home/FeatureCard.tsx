import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

export default function FeatureCard({ icon: Icon, title, description, iconColor }: FeatureCardProps) {
  return (
    <Card className="bg-[#F9FAFB] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4 text-3xl" style={{ color: iconColor }}>
        <Icon strokeWidth={1.5} size={28} />
      </div>
      <h3 className="text-xl font-bold mb-2 font-poppins">{title}</h3>
      <p className="text-[#4B5563]">{description}</p>
    </Card>
  );
}
