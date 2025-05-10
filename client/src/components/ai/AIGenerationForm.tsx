import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Wand2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Form schemas
const textGenerationSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  subject: z.string().min(1, "Subject is required"),
});

const quizGenerationSchema = z.object({
  setId: z.string().min(1, "Please select a flashcard set"),
  quizType: z.enum(["multiple_choice", "fill_blank", "matching", "mixed"]),
  questionCount: z.number().min(5).max(30),
});

type TextGenerationValues = z.infer<typeof textGenerationSchema>;
type QuizGenerationValues = z.infer<typeof quizGenerationSchema>;

interface FlashcardSet {
  id: number;
  title: string;
  cardCount: number;
}

interface AIGenerationFormProps {
  flashcardSets?: FlashcardSet[];
  type: "text" | "quiz";
  onSuccess: (data: any) => void;
}

export default function AIGenerationForm({ flashcardSets = [], type, onSuccess }: AIGenerationFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Form for text generation
  const textForm = useForm<TextGenerationValues>({
    resolver: zodResolver(textGenerationSchema),
    defaultValues: {
      content: "",
      subject: "",
    },
  });
  
  // Form for quiz generation
  const quizForm = useForm<QuizGenerationValues>({
    resolver: zodResolver(quizGenerationSchema),
    defaultValues: {
      setId: "",
      quizType: "multiple_choice",
      questionCount: 15,
    },
  });
  
  const onTextSubmit = async (values: TextGenerationValues) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest(
        "POST", 
        "/api/ai/generate-flashcards", 
        {
          ...values,
          userId: 1 // In a real app, this would be the user's ID from auth
        }
      );
      
      const data = await response.json();
      toast({
        title: "Flashcards Generated",
        description: `Successfully created ${data.flashcards.length} flashcards`,
      });
      onSuccess(data);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onQuizSubmit = async (values: QuizGenerationValues) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest(
        "POST", 
        "/api/ai/generate-quiz", 
        {
          ...values,
          userId: 1 // In a real app, this would be the user's ID from auth
        }
      );
      
      const data = await response.json();
      toast({
        title: "Quiz Generated",
        description: `Successfully created a ${values.quizType} quiz with ${values.questionCount} questions`,
      });
      onSuccess(data);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (type === "text") {
    return (
      <Card className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h3 className="text-xl font-bold mb-4 font-poppins">Generate Flashcards from Text</h3>
        
        <Form {...textForm}>
          <form onSubmit={textForm.handleSubmit(onTextSubmit)} className="space-y-5">
            <FormField
              control={textForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4B5563] font-medium">Paste your study material:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your notes, textbook excerpt, or any learning material here..."
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={textForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4B5563] font-medium">Subject/Topic:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Biology, World History, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </form>
        </Form>
        
        <p className="text-sm text-gray-500 mt-3 text-center">Our AI will analyze your text and create optimized question-answer pairs.</p>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h3 className="text-xl font-bold mb-4 font-poppins">Generate Quiz from Flashcards</h3>
      
      <Form {...quizForm}>
        <form onSubmit={quizForm.handleSubmit(onQuizSubmit)} className="space-y-5">
          <FormField
            control={quizForm.control}
            name="setId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#4B5563] font-medium">Select flashcard set:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
                      <SelectValue placeholder="Select a flashcard set" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {flashcardSets.map((set) => (
                      <SelectItem key={set.id} value={set.id.toString()}>
                        {set.title} ({set.cardCount} cards)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={quizForm.control}
            name="quizType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#4B5563] font-medium">Quiz type:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem value="multiple_choice" id="mcq" />
                      <Label htmlFor="mcq" className="ml-2">Multiple Choice</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="fill_blank" id="fillblank" />
                      <Label htmlFor="fillblank" className="ml-2">Fill in the Blank</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="matching" id="matching" />
                      <Label htmlFor="matching" className="ml-2">Matching</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="ml-2">Mixed Format</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={quizForm.control}
            name="questionCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#4B5563] font-medium">Number of questions:</FormLabel>
                <FormControl>
                  <Slider 
                    defaultValue={[field.value]}
                    max={30}
                    min={5}
                    step={1}
                    onValueChange={(val) => field.onChange(val[0])}
                  />
                </FormControl>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5</span>
                  <span>{field.value}</span>
                  <span>30</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Quiz...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Create Quiz
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <p className="text-sm text-gray-500 mt-3 text-center">AI will create a challenging quiz with high-quality distractors based on your flashcards.</p>
    </Card>
  );
}
