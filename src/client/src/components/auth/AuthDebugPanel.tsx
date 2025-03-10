import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

// Track attempts to get tokens for better error reporting
interface TokenAttempt {
  timestamp: Date;
  success: boolean;
  error?: string;
}

export function AuthDebugPanel() {
  const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const { toast } = useToast();
  
  // State for tracking token operations
  const [tokenAttempts, setTokenAttempts] = useState<TokenAttempt[]>([]);
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  // Test the clerk token retrieval
  const testClerkToken = async () => {
    if (!isClerkLoaded || !isSignedIn) {
      toast({
        title: "Not authenticated",
        description: "You must be signed in to get a token",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingToken(true);

    try {
      console.log("Attempting to get token from Clerk...");
      const token = await getToken();

      if (token) {
        // Store a preview of the token (first 10 chars)
        const tokenPreview = `${token.substring(0, 10)}...`;
        setCurrentToken(tokenPreview);
        
        // Record the successful attempt
        const attempt: TokenAttempt = {
          timestamp: new Date(),
          success: true,
        };
        setTokenAttempts([attempt, ...tokenAttempts]);
        
        toast({
          title: "Token retrieved",
          description: "Successfully got a token from Clerk",
        });
      } else {
        // Record the failed attempt
        const attempt: TokenAttempt = {
          timestamp: new Date(),
          success: false,
          error: "Token was null",
        };
        setTokenAttempts([attempt, ...tokenAttempts]);
        
        toast({
          title: "No token available",
          description: "Token retrieval returned null",
          variant: "destructive",
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error getting token:", error);
      
      // Record the failed attempt
      const attempt: TokenAttempt = {
        timestamp: new Date(),
        success: false,
        error: error.message || "Unknown error",
      };
      setTokenAttempts([attempt, ...tokenAttempts]);
      
      toast({
        title: "Token error",
        description: `Failed to get token: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCheckingToken(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "Successfully signed out from Clerk",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Sign out error",
        description: `Failed to sign out: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Authentication Debug Panel
          <div>
            <Badge variant={isSignedIn ? "default" : "destructive"}>
              {isClerkLoaded
                ? isSignedIn
                  ? "Signed In"
                  : "Not Signed In"
                : "Loading..."}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="clerk">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clerk">Clerk Auth</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clerk" className="space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm font-medium">Status:</span>
                </div>
                <div className="flex items-center">
                  {!isClerkLoaded ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isSignedIn ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>
                    {!isClerkLoaded
                      ? "Loading Clerk..."
                      : isSignedIn
                      ? "Authenticated"
                      : "Not Authenticated"}
                  </span>
                </div>
              </div>
              
              {isSignedIn && clerkUser && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">User ID:</span>
                    </div>
                    <div>
                      <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">
                        {clerkUser.id}
                      </code>
                    </div>
                  </div>
                  
                  {clerkUser.username && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-medium">Username:</span>
                      </div>
                      <div>{clerkUser.username}</div>
                    </div>
                  )}
                  
                  {clerkUser.primaryEmailAddress && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-medium">Email:</span>
                      </div>
                      <div>{clerkUser.primaryEmailAddress.emailAddress}</div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={testClerkToken}
                disabled={isCheckingToken || !isClerkLoaded || !isSignedIn}
              >
                {isCheckingToken ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  "Test Token"
                )}
              </Button>
              
              {isSignedIn && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tokens" className="space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm font-medium">Current Token:</span>
                </div>
                <div>
                  {currentToken ? (
                    <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">
                      {currentToken}
                    </code>
                  ) : (
                    <span className="text-slate-500 text-sm italic">No token retrieved yet</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Token Attempts:</h3>
              {tokenAttempts.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No token attempts yet</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tokenAttempts.map((attempt, index) => (
                    <Alert
                      key={index}
                      variant={attempt.success ? "default" : "destructive"}
                    >
                      <div className="flex items-start">
                        {attempt.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <AlertTitle>
                            {attempt.success ? "Success" : "Failed"}
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            <div>
                              <span className="font-medium">Time:</span>{" "}
                              {attempt.timestamp.toLocaleTimeString()}
                            </div>
                            {!attempt.success && attempt.error && (
                              <div className="mt-1">
                                <span className="font-medium">Error:</span>{" "}
                                {attempt.error}
                              </div>
                            )}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}