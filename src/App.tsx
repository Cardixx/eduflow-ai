import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ECList from "./pages/student/ECList";
import EnrollmentPage from "./pages/student/EnrollmentPage";
import FeedbackHistory from "./pages/student/FeedbackHistory";
import FeedbackViewer from "./pages/teacher/FeedbackViewer";
import SentimentAnalysis from "./pages/teacher/SentimentAnalysis";
import Reports from "./pages/teacher/Reports";
import UserManagement from "./pages/admin/UserManagement";
import AcademicStructure from "./pages/admin/AcademicStructure";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="ecs" element={<EnrollmentRouter />} />
                <Route path="feedback" element={<FeedbackRouter />} />
                <Route path="history" element={<FeedbackHistory />} />
                <Route path="sentiment" element={<ProtectedRoute roles={["TEACHER", "ADMIN"]}><SentimentAnalysis /></ProtectedRoute>} />
                <Route path="reports" element={<ProtectedRoute roles={["TEACHER", "ADMIN"]}><Reports /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute roles={["ADMIN"]}><UserManagement /></ProtectedRoute>} />
                <Route path="structure" element={<ProtectedRoute roles={["ADMIN"]}><AcademicStructure /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Route /app/feedback → ECList for students (modal flow), Viewer for teachers/admins
import { useAuth } from "@/contexts/AuthContext";
function FeedbackRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "STUDENT" ? <ECList /> : <FeedbackViewer />;
}

function EnrollmentRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "STUDENT" ? <EnrollmentPage /> : <FeedbackViewer />;
}

export default App;
