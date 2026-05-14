
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <FileQuestion className="w-10 h-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter font-headline text-white">404 - Lost in Orbit</h1>
          <p className="text-muted-foreground text-lg">
            The resource you are looking for has been moved or doesn't exist in our pipeline.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-12 px-8 font-bold shadow-xl shadow-primary/20">
          <Link href="/dashboard">Return to Workspace</Link>
        </Button>
      </div>
    </div>
  );
}
