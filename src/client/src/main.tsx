import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { dark } from "@clerk/themes";
import { UIProvider } from "./context/UIContext";
import { ProjectProvider } from "./context/ProjectContext";
import { AuthProvider } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";

// Get the publishable key from the window.ENV object that's defined in index.html
const PUBLISHABLE_KEY = window.ENV?.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create the root element
const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the app with a simple, synchronous approach
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 
            "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
          card: "bg-slate-800 border-slate-700",
          headerTitle: "text-white",
          headerSubtitle: "text-slate-300",
          formFieldLabel: "text-slate-300",
          formFieldInput: 
            "bg-slate-900 border-slate-700 text-white focus:border-indigo-500"
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <ProjectProvider>
              <App />
            </ProjectProvider>
          </UIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);
