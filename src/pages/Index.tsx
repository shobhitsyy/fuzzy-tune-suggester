import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Recommendations from "./Recommendations";

const queryClient = new QueryClient();

const Index = () => {
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-blue-100">
        <div className="font-bold text-lg text-blue-800">Your Music App</div>
        <div className="flex gap-3 items-center">
          {/* Only show admin link if not already in admin */}
          {!isAdmin && (
            <Link to="/admin" className="text-blue-700 hover:underline font-medium">
              Admin
            </Link>
          )}
        </div>
      </nav>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default Index;
