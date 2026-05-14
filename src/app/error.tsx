
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter font-headline text-white">System Error</h1>
          <p className="text-muted-foreground text-lg">
            An unexpected error occurred in the CRM intelligence engine.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="bg-primary hover:bg-primary/90 h-12 px-8 font-bold shadow-xl shadow-primary/20 gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/dashboard'}
            className="text-muted-foreground hover:text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
