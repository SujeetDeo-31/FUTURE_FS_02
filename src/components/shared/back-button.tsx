"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // If we have history, go back, otherwise go to dashboard
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-white hover:bg-white/5 gap-2 px-2 -ml-2 group transition-all"
      >
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.div>
        <span className="text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">
          Back
        </span>
      </Button>
    </motion.div>
  );
}
