
"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, CreditCard, Save, Lock, Banknote } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AccountService } from '@/services/account-service';
import { toast } from 'sonner';

const TABS = [
  { icon: User, label: "Account" },
  { icon: Shield, label: "Security" },
  { icon: Bell, label: "Notifications" },
  { icon: CreditCard, label: "Billing" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Account');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        const response = await AccountService.getAccount();
        if (response.data) {
          setName(response.data.name);
          setBio(response.data.bio);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.error('Failed to fetch account', error);
        toast.error('Failed to load account details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await AccountService.updateAccount({ name, bio });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update account', error);
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading && activeTab === 'Account') {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'Account':
        return (
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
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input value={email} disabled className="bg-white/5 border-white/10 opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Bio</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} className="bg-white/5 border-white/10" />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-primary hover:bg-primary/90 gap-2 px-8">
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                </Button>
              </div>
            </div>
          </GlassCard>
        );
      case 'Security':
        return (
          <GlassCard>
             <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <Lock className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your password and two-factor authentication.</p>
                </div>
              </div>
              <div className="text-center py-10 text-muted-foreground">
                Security settings coming soon.
              </div>
            </div>
          </GlassCard>
        );
      case 'Notifications':
        return (
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
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">System Updates</p>
                    <p className="text-xs text-muted-foreground">Be the first to know about new features and improvements.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </GlassCard>
        );
      case 'Billing':
          return (
            <GlassCard>
               <div className="p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <Banknote className="w-6 h-6 text-sky-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Billing</h2>
                    <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
                  </div>
                </div>
                <div className="text-center py-10 text-muted-foreground">
                  Billing management coming soon.
                </div>
              </div>
            </GlassCard>
          );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold font-headline text-white">Settings</h1>
        <p className="text-muted-foreground mt-1.5">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <GlassCard>
            <nav className="p-2 space-y-1">
              {TABS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    activeTab === item.label
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

        <div className="lg:col-span-3 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
