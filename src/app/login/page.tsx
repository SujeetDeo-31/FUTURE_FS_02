
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, Variants } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Zap, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-900 text-white flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-violet-500/10">
          <motion.div
            className="absolute -top-16 -right-16 w-48 h-48 bg-violet-500 rounded-full filter blur-4xl opacity-20"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full filter blur-4xl opacity-10"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.div variants={itemVariants} className="relative z-10">
            <Link href="/" className="flex items-center justify-center mb-6 text-2xl font-bold font-headline tracking-tighter text-white no-underline">
                <BrainCircuit className="w-8 h-8 mr-2.5 text-primary" />
                Cogni<span className="text-primary">Track</span>
            </Link>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-center text-2xl font-bold font-headline text-white mb-2 tracking-tight"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-muted-foreground mb-8"
          >
            Enter your credentials to access your workspace.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="email"
                className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 mt-2"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="password"
                className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 mt-2"
              />
            </motion.div>

            {error && (
                <motion.p variants={itemVariants} className="text-sm text-red-400 font-medium text-center">
                    {error}
                </motion.p>
            )}

            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full h-11 mt-4 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                     <Zap className="w-4 h-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

            <motion.div variants={itemVariants} className="text-center text-xs text-muted-foreground mt-8">
                <p>
                    Don't have an account?{' '}
                    <Link href="#" className="font-bold text-primary hover:underline">
                        Contact Support
                    </Link>
                </p>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
