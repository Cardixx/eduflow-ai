import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { mapNotification, type NotificationDto } from "@/lib/backend";
import type { Notification } from "@/types";

export function Topbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<NotificationDto[]>("/notifications/me");
        setNotifs(data.map(mapNotification));
      } catch {
        setNotifs([]);
      }
    };
    void load();
  }, []);

  const markAllAsRead = async () => {
    const unreadIds = notifs.filter((n) => !n.read).map((n) => n.id);
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    await Promise.allSettled(unreadIds.map((id) => api.patch(`/notifications/${id}/read`)));
  };

  return (
    <header className="h-16 px-4 lg:px-8 flex items-center gap-4 border-b border-border/60 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/60 max-w-md w-full input-glow transition-all">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher un EC, étudiant, rapport…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden lg:inline text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>

      <button
        onClick={toggle}
        className="relative h-10 w-10 grid place-items-center rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </motion.div>
        </AnimatePresence>
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative h-10 w-10 grid place-items-center rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-aurora grid place-items-center text-[10px] font-bold text-white animate-pulse-glow">
              {unread}
            </span>
          )}
        </button>
        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-[360px] z-50 card-elegant glass-strong overflow-hidden"
              >
                <div className="p-4 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <div className="font-display font-semibold">Notifications</div>
                    <div className="text-xs text-muted-foreground">{unread} non lues</div>
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Tout marquer lu
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
                  {notifs.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn("p-4 hover:bg-muted/40 transition-colors relative", !n.read && "bg-primary/5")}
                    >
                      {!n.read && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary animate-pulse-glow" />}
                      <div className="flex items-start gap-3 pl-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg grid place-items-center shrink-0",
                          n.type === "success" && "bg-success/15 text-success",
                          n.type === "info" && "bg-primary/15 text-primary",
                          n.type === "warning" && "bg-warning/15 text-warning",
                        )}>
                          <Bell className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{n.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
