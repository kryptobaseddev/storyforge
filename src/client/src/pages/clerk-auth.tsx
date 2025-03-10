import { SignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ClerkAuthPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-6 relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link href="/clerk-debug">
            <Button size="sm" variant="ghost">Debug</Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" variant="ghost">Alt Auth</Button>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In with Clerk</h1>
        <p className="text-slate-300 mb-8 text-center">
          Use this direct Clerk authentication component to test sign-in functionality
        </p>
        
        <div className="mb-8">
          <SignIn />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-4">
            This is a simplified auth page that uses Clerk directly, bypassing our protected routes
          </p>
        </div>
      </div>
    </div>
  );
}