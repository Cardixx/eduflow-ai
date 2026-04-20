import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageTransition } from "@/components/PageTransition";

export function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background mesh-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 p-4 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
