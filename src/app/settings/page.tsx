"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, CreditCard, Save } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold font-headline text-white">Settings</h1>
        <p className="text-muted-foreground mt-1.5">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Update your personal details and public profile.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input defaultValue="Admin User" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input defaultValue="admin@example.com" disabled className="bg-white/5 border-white/10 opacity-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Bio</Label>
                <Input defaultValue="Sales Lead at LeadFlow Enterprise." className="bg-white/5 border-white/10" />
              </div>

              <Separator className="bg-white/5" />

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 gap-2 px-8">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Bell className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Configure how you receive alerts and reports.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Lead Alerts</p>
                    <p className="text-xs text-muted-foreground">Receive instant notifications when a new lead is assigned.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Weekly Reports</p>
                    <p className="text-xs text-muted-foreground">Get a summary of your team's performance every Monday.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <nav className="p-2 space-y-1">
              {[
                { icon: User, label: "Account", active: true },
                { icon: Shield, label: "Security", active: false },
                { icon: Bell, label: "Notifications", active: false },
                { icon: CreditCard, label: "Billing", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    item.active 
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </GlassCard>

          <GlassCard className="bg-destructive/5 border-destructive/10">
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-destructive uppercase tracking-widest">Danger Zone</h3>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all associated lead data. This action is irreversible.</p>
              <Button variant="destructive" className="w-full text-xs font-bold uppercase tracking-widest h-10">
                Delete Account
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
