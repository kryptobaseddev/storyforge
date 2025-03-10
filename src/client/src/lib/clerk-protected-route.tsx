import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ClerkProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
}

export function ClerkProtectedRoute({
  path,
  component: Component,
}: ClerkProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!isSignedIn) {
    return (
      <Route path={path}>
        <Redirect to="/sign-in" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}