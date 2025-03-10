import { Link } from "wouter";
import { UserButton, UserProfile } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { AuthDebugPanel } from "@/components/auth/AuthDebugPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Tools</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/clerk-debug">
                <Button className="w-full" variant="outline">Clerk Debug</Button>
              </Link>
              <Link href="/clerk-auth">
                <Button className="w-full" variant="outline">Clerk Auth</Button>
              </Link>
              <Link href="/sign-in">
                <Button className="w-full" variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full" variant="outline">Sign Up</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full" variant="outline">Auth Page</Button>
              </Link>
              <Link href="/login">
                <Button className="w-full" variant="outline">Login Page</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full" variant="outline">Dashboard</Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="outline">Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Clerk Components
              <div>
                <UserButton />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">
              This shows the Clerk UI components for reference:
            </p>
            
            <div className="border rounded-md p-4 mb-4">
              <h3 className="text-sm font-medium mb-2">UserButton:</h3>
              <div className="flex justify-center">
                <UserButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <AuthDebugPanel />
        
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Auth Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="variables">Environment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Approach:</strong> We're using Clerk for authentication, with server-side middleware
                    through @clerk/express and frontend integration through @clerk/clerk-react.
                  </p>
                  <p>
                    <strong>Current Issues:</strong> We've identified naming conflicts between Clerk's auth hooks
                    and our custom authentication system. We're also making sure environment variables are properly
                    formatted.
                  </p>
                  <p>
                    <strong>Debug Flow:</strong> This page lets you test each authentication aspect in isolation to
                    diagnose where problems might be occurring.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="variables">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Frontend ENV:</strong> The Clerk publishable key is available in the browser through 
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mx-1 text-xs">
                      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
                    </code>
                  </p>
                  <p>
                    <strong>Backend ENV:</strong> The Clerk secret key is available server-side through
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mx-1 text-xs">
                      process.env.CLERK_SECRET_KEY
                    </code>
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Note: For security reasons, we can't display the actual values of these secrets.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}