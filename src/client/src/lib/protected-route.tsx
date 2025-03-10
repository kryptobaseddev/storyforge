import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import React from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.FC<{}> | (() => React.JSX.Element);
}) {
  const { user, isLoading } = useAuth();

  // Create a wrapped component that handles authentication logic
  const WrappedComponent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to="/auth" />;
    }

    // This works with both FC<{}> and () => JSX.Element
    return <Component />;
  };

  return <Route path={path} component={WrappedComponent} />;
}