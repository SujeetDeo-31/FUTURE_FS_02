
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
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Lead Manager", icon: Users, href: "/leads" },
  { name: "Insights", icon: BarChart3, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border sticky top-0 z-40">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-lg font-headline font-bold tracking-tight text-white">
            LeadFlow
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enterprise AI</p>
        </div>
      </div>

      <div className="px-4 py-2">
        <Button className="w-full h-11 justify-start px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all" asChild>
          <Link href="/leads/new">
            <PlusCircle className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-semibold">New Lead</span>
          </Link>
        </Button>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm",
                isActive
                  ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebarIndicator"
                  className="ml-auto w-1 h-4 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mb-4 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Credits</p>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-lg font-bold text-white leading-none">386</span>
            <span className="text-[10px] text-muted-foreground">/ 500</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '77%' }}
              className="h-full bg-primary" 
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sidebar-foreground hover:text-destructive transition-all rounded-lg hover:bg-destructive/10 font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
