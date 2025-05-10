import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import CreateFlashcard from "@/pages/create-flashcard";
import Study from "@/pages/study";
import AIGenerator from "@/pages/ai-generator";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/create-flashcard" component={CreateFlashcard} />
        <Route path="/study/:id" component={Study} />
        <Route path="/ai-generator" component={AIGenerator} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
