import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ClerkDebugPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const clerkAuth = useClerkAuth();
  const { toast } = useToast();
  
  const [tokenAvailable, setTokenAvailable] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Check if token is available
  const checkToken = async () => {
    if (!isLoaded || !isSignedIn) {
      toast({
        title: "Not signed in",
        description: "You must be signed in with Clerk to check for a token",
        variant: "destructive"
      });
      setTokenAvailable(false);
      return;
    }
    
    setChecking(true);
    
    try {
      console.log("Attempting to get token from Clerk");
      const token = await clerkAuth.getToken();
      
      if (token) {
        console.log("Successfully retrieved token");
        setTokenAvailable(true);
        // Only show the first few characters for security
        setToken(`${token.substring(0, 10)}...`);
        toast({
          title: "Token Retrieved",
          description: "Successfully got a token from Clerk authentication.",
        });
      } else {
        console.log("No token available");
        setTokenAvailable(false);
        setToken(null);
        toast({
          title: "No Token Available",
          description: "Could not retrieve a token from Clerk.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting token:", error);
      setTokenAvailable(false);
      setToken(null);
      toast({
        title: "Error",
        description: `Failed to get token: ${error}`,
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Clerk Authentication Debug</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clerk Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Is Loaded:</strong> {isLoaded ? "Yes" : "No"}</p>
              <p><strong>Is Signed In:</strong> {isSignedIn ? "Yes" : "No"}</p>
              <p><strong>User ID:</strong> {isSignedIn && clerkUser ? clerkUser.id : "Not signed in"}</p>
              {isSignedIn && clerkUser && (
                <>
                  <p><strong>Username:</strong> {clerkUser.username || "N/A"}</p>
                  <p><strong>Email:</strong> {clerkUser.primaryEmailAddress?.emailAddress || "N/A"}</p>
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <p><strong>Token Available:</strong> {
                checking 
                  ? "Checking..." 
                  : (tokenAvailable === null 
                    ? "Not checked yet" 
                    : (tokenAvailable ? "Yes" : "No"))
              }</p>
              {token && (
                <p><strong>Token Preview:</strong> <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{token}</code></p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={checkToken}
                disabled={checking || !isLoaded || !isSignedIn}
              >
                {checking ? "Checking..." : "Check Clerk Token"}
              </Button>
              
              <Link href="/auth">
                <Button variant="outline">
                  Go to Auth Page
                </Button>
              </Link>
              
              <Link href="/sign-in">
                <Button variant="outline">
                  Go to Clerk Sign In
                </Button>
              </Link>
              
              <Link href="/auth-debug">
                <Button variant="outline">
                  Go to Full Auth Debug
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}