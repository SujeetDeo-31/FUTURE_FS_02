
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 mb-4">
          <Zap className="w-4 h-4 fill-primary" />
          <span className="text-sm font-bold tracking-tight uppercase">Smarter CRM for High Growth Teams</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight tracking-tighter">
          Master Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Lead Flow</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          The intelligent dashboard that turns cold leads into closed deals using automated tracking and AI insights.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg font-bold gap-2" asChild>
          <Link href="/dashboard">
            Enter Admin Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border bg-card/50">
          Book a Demo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-12">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-headline">Lead Management</h3>
          <p className="text-muted-foreground">Comprehensive tracking for every stage of your sales pipeline.</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-headline">AI Next Action</h3>
          <p className="text-muted-foreground">Intelligent suggestions to ensure you never miss a follow-up opportunity.</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-headline">Advanced Analytics</h3>
          <p className="text-muted-foreground">Real-time reports on conversion rates and lead source performance.</p>
        </div>
      </div>

      <footer className="pt-20 text-muted-foreground text-sm flex items-center gap-2">
        <Zap className="w-4 h-4" /> LeadFlow CRM © 2024. Built for the modern sales force.
      </footer>
    </div>
  );
}
