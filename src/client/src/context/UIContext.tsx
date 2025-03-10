import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ToolType, AIAssistance } from "@/types";

// Define the context type
type UIContextType = {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  currentTool: ToolType | null;
  setCurrentTool: (tool: ToolType | null) => void;
  oracleOpen: boolean;
  setOracleOpen: (open: boolean) => void;
  toggleOracle: () => void;
  oracleAssistance: AIAssistance | null;
  setOracleAssistance: (assistance: AIAssistance | null) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

// Create default values to make the context more resilient
const defaultUIContext: UIContextType = {
  sidebarExpanded: true,
  toggleSidebar: () => {}, // Empty function as default
  currentTool: null,
  setCurrentTool: () => {}, // Empty function as default
  oracleOpen: false,
  setOracleOpen: () => {}, // Empty function as default
  toggleOracle: () => {}, // Empty function as default
  oracleAssistance: null,
  setOracleAssistance: () => {}, // Empty function as default
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {} // Empty function as default
};

// Use default values to create the context
const UIContext = createContext<UIContextType>(defaultUIContext);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  console.log("Initializing UI Context");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentTool, setCurrentTool] = useState<ToolType | null>(null);
  const [oracleOpen, setOracleOpen] = useState(false);
  const [oracleAssistance, setOracleAssistance] = useState<AIAssistance | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure context is properly initialized
  useEffect(() => {
    if (!isInitialized) {
      console.log("UI Context fully initialized");
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  const toggleOracle = () => {
    setOracleOpen((prev) => !prev);
  };

  // Create the actual context value
  const contextValue: UIContextType = {
    sidebarExpanded,
    toggleSidebar,
    currentTool,
    setCurrentTool,
    oracleOpen,
    setOracleOpen,
    toggleOracle,
    oracleAssistance,
    setOracleAssistance,
    isMobileMenuOpen,
    setMobileMenuOpen
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  try {
    const context = useContext(UIContext);
    return context;
  } catch (error) {
    console.error("Error using UI context:", error);
    // Return default context in case of error
    return defaultUIContext;
  }
};