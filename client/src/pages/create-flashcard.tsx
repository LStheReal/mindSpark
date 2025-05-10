import { useState } from "react";
import { useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Loader2, Plus, Trash2, ChevronLeft } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const flashcardSetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  color: z.string().default("#3B82F6"),
  flashcards: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
      imageUrl: z.string().optional(),
    })
  ).min(1, "At least one flashcard is required"),
});

type FlashcardSetFormValues = z.infer<typeof flashcardSetSchema>;

export default function CreateFlashcard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });
  
  const form = useForm<FlashcardSetFormValues>({
    resolver: zodResolver(flashcardSetSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      color: "#3B82F6",
      flashcards: [{ question: "", answer: "", imageUrl: "" }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });
  
  const onSubmit = async (values: FlashcardSetFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create flashcards",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/flashcard-sets", {
        ...values,
        userId: user?.id,
        categoryId: values.categoryId ? parseInt(values.categoryId) : undefined,
      });
      
      const data = await response.json();
      
      toast({
        title: "Flashcard set created",
        description: `Successfully created "${values.title}" with ${values.flashcards.length} cards`,
      });
      
      // Invalidate the flashcard sets query to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/flashcard-sets"] });
      
      // Navigate to the dashboard
      navigate("/dashboard");
      
    } catch (error) {
      toast({
        title: "Error creating flashcard set",
        description: "There was an error creating your flashcard set. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
          
          <Card className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-md">
            <h1 className="text-2xl font-bold mb-6 font-poppins">Create New Flashcard Set</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Biology Fundamentals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No Category</SelectItem>
                            {categories?.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add a brief description of this flashcard set" 
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set Color</FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Input 
                            type="color" 
                            className="h-10 w-20" 
                            {...field} 
                          />
                        </FormControl>
                        <div 
                          className="w-8 h-8 rounded-full" 
                          style={{ backgroundColor: field.value }}
                        ></div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Flashcards</h2>
                    <Button
                      type="button"
                      onClick={() => append({ question: "", answer: "", imageUrl: "" })}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Card
                    </Button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-5 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Card {index + 1}</h3>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`flashcards.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter the front side of the card" 
                                  className="h-24"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`flashcards.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Answer</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter the back side of the card" 
                                  className="h-24"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`flashcards.${index}.imageUrl`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter an image URL for this card" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="px-6 py-2 bg-[#3B82F6] text-white hover:bg-[#1E40AF]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Flashcard Set'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
