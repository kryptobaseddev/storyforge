import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/theme-provider';
import MainLayout from './components/layout/MainLayout';
import './App.css';

// Import pages (we'll create these later)
// Use lazy loading for better performance
const Dashboard = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const Projects = React.lazy(() => import('./pages/projects/ProjectsPage'));

/**
 * Main App Component
 * 
 * Sets up routing and provides the app shell
 */
const App: React.FC = () => {
  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="storyforge-theme">
      <Router>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
            <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />
            
            {/* Routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              
              {/* Project routes */}
              <Route path="project">
                <Route path="characters" element={<div>Characters (Coming Soon)</div>} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
                <Route path="plots" element={<div>Plots (Coming Soon)</div>} />
                <Route path="chapters" element={<div>Chapters (Coming Soon)</div>} />
                <Route path="exports" element={<div>Exports (Coming Soon)</div>} />
              </Route>
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
