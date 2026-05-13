
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn(
        "bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden hover:border-primary/20 transition-all duration-300",
        className
      )}>
        {children}
      </Card>
    </motion.div>
  );
}
