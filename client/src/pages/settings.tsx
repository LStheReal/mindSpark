import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, KeyRound, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  useOwnApi: z.boolean().default(true),
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

export default function Settings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
      useOwnApi: true,
    },
  });
  
  const onSubmit = async (values: ApiKeyFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to save settings",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/settings/api-key", {
        ...values,
        userId: user?.id,
      });
      
      const data = await response.json();
      
      toast({
        title: "Settings saved",
        description: "Your API settings have been updated successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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
            <h1 className="text-2xl font-bold mb-6 font-poppins">Settings</h1>
            
            <Tabs defaultValue="api" className="space-y-4">
              <TabsList>
                <TabsTrigger value="api">API Settings</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="api">
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <div className="flex items-center gap-3 mb-5">
                    <KeyRound className="h-5 w-5 text-[#3B82F6]" />
                    <h2 className="text-xl font-semibold">OpenAI API Settings</h2>
                  </div>
                  
                  <p className="mb-6 text-[#4B5563]">
                    MindSpark uses OpenAI's API to generate flashcards and quizzes. You can use your own API key for better performance and to access more advanced features.
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="useOwnApi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Use My Own OpenAI API Key</FormLabel>
                              <FormDescription>
                                Toggle this to use your personal API key instead of the shared one.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("useOwnApi") && (
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>OpenAI API Key</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="sk-..."
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your API key will be encrypted and stored securely. 
                                You can get an API key from the <a 
                                  href="https://platform.openai.com/api-keys" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#3B82F6] hover:underline"
                                >
                                  OpenAI dashboard
                                </a>.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex items-center gap-4">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#3B82F6] text-white hover:bg-[#1E40AF]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Settings
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                  
                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-lg font-medium text-amber-800 mb-2">API Usage Information</h3>
                    <p className="text-amber-700 mb-3">
                      Using your own OpenAI API key provides several benefits:
                    </p>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                      <li>Access to the latest models like GPT-4o for better flashcard and quiz generation</li>
                      <li>Higher rate limits for generating more content</li>
                      <li>More control over your usage and billing</li>
                    </ul>
                    <p className="text-sm text-amber-700 mt-3">
                      If you don't provide your own API key, you'll be limited to basic functionality
                      with our shared API key, which may have stricter rate limits.
                    </p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <p className="text-[#4B5563]">
                    Account settings will be implemented in a future update.
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card className="p-6 md:p-8 bg-white shadow-md">
                  <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                  <p className="text-[#4B5563]">
                    Notification settings will be implemented in a future update.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}