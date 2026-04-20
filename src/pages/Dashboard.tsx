import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import StudentDashboard from "./student/StudentDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import AdminDashboard from "./admin/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {user.role === "STUDENT" && <StudentDashboard />}
      {user.role === "TEACHER" && <TeacherDashboard />}
      {user.role === "ADMIN" && <AdminDashboard />}
    </motion.div>
  );
}
