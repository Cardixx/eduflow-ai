import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, MessageSquare, History, Users, Network,
  BarChart3, GraduationCap, LogOut, Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const studentNav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/ecs", label: "Mes ECs", icon: BookOpen },
  { to: "/app/feedback", label: "Donner un avis", icon: MessageSquare },
  { to: "/app/history", label: "Historique", icon: History },
];
const teacherNav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/ecs", label: "Mes ECs", icon: BookOpen },
  { to: "/app/feedback", label: "Feedbacks", icon: MessageSquare },
  { to: "/app/sentiment", label: "Sentiment AI", icon: Sparkles },
  { to: "/app/reports", label: "Rapports", icon: BarChart3 },
];
const adminNav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/users", label: "Utilisateurs", icon: Users },
  { to: "/app/structure", label: "Structure LMD", icon: Network },
  { to: "/app/feedback", label: "Tous les feedbacks", icon: MessageSquare },
  { to: "/app/reports", label: "Rapports", icon: BarChart3 },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user?.role === "ADMIN" ? adminNav : user?.role === "TEACHER" ? teacherNav : studentNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/60 bg-sidebar/80 backdrop-blur-xl relative z-20">
      <div className="p-6 flex items-center gap-3">
        <motion.div
          initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="h-10 w-10 rounded-xl overflow-hidden bg-white grid place-items-center shadow-glow"
        >
          <img 
            src="/icon.png" 
            alt="EMIT Logo" 
            className="h-8 w-8 object-contain"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-gradient-aurora');
              const icon = document.createElement('div');
              icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
              e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
            }}
          />
        </motion.div>
        <div>
          <div className="font-display font-bold text-lg leading-none">EMIT</div>
          <div className="text-[11px] text-muted-foreground tracking-wider uppercase">Fianarantsoa</div>
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-1">
        {items.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className="relative h-4 w-4 shrink-0" />
                  <span className="relative">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-3 border-t border-border/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/40">
          <div className="h-9 w-9 rounded-full bg-gradient-aurora grid place-items-center text-white font-semibold text-sm">
            {user?.fullName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.fullName}</div>
            <div className="text-[11px] text-muted-foreground truncate">{user?.role}</div>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
