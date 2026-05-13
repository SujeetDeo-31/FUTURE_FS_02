
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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Leads", icon: Users, href: "/leads" },
  { name: "Analytics", icon: BarChart3, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border sticky top-0">
      <div className="flex items-center gap-2 p-6">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Zap className="w-6 h-6 text-primary fill-primary/20" />
        </div>
        <h1 className="text-xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          LeadFlow CRM
        </h1>
      </div>

      <div className="px-4 py-2">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white font-medium" asChild>
          <Link href="/leads/new">
            <PlusCircle className="w-4 h-4" />
            Add New Lead
          </Link>
        </Button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10 mb-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">AI Credits</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">124 / 500</span>
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Pro</span>
          </div>
          <div className="w-full h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '25%' }} />
          </div>
        </div>

        <button className="flex items-center gap-3 w-full px-3 py-2 text-sidebar-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
