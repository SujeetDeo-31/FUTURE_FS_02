
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Lead Manager", icon: Users, href: "/leads" },
  { name: "Insights", icon: BarChart3, href: "/reports" },
  { name: "Workspace", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-72 h-screen bg-sidebar border-r border-sidebar-border sticky top-0 z-40">
      <div className="flex items-center gap-3 p-8">
        <div className="bg-primary/20 p-2.5 rounded-xl ring-1 ring-primary/40 shadow-lg shadow-primary/10">
          <Zap className="w-6 h-6 text-primary fill-primary/20" />
        </div>
        <div>
          <h1 className="text-xl font-headline font-bold tracking-tighter text-gradient">
            LeadFlow
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enterprise</p>
        </div>
      </div>

      <div className="px-6 py-2">
        <Button className="w-full h-12 justify-between px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
          <Link href="/leads/new">
            <span className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Capture Lead
            </span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </Link>
        </Button>
      </div>

      <nav className="flex-1 mt-8 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-bold text-sm",
                isActive
                  ? "text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/10 border-l-2 border-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors relative z-10",
                isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
              )} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">GenAI Power</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-100">124 / 500 Credits</span>
            <Zap className="w-3 h-3 text-primary animate-pulse" />
          </div>
          <div className="w-full h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              className="h-full bg-primary" 
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <button className="flex items-center gap-3 w-full px-4 py-3 text-sidebar-foreground hover:text-destructive transition-all rounded-xl hover:bg-destructive/10 font-bold text-sm">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
