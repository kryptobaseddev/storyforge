import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/theme-provider';
import { UIProvider } from './context/UIContext';
import MainLayout from './components/layout/MainLayout';
import './App.css';

// Import tRPC providers
import { trpc, trpcClient, queryClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext';

// Import ProtectedRoute
import ProtectedRoute from './components/common/ProtectedRoute';

// Import UI components
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

// Import Auth Pages
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import ForgotPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';

// Use lazy loading for better performance
const Dashboard = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const Projects = React.lazy(() => import('./pages/projects/ProjectsPage'));
const CreateProject = React.lazy(() => import('./pages/projects/create'));
const ProjectDetail = React.lazy(() => import('./pages/projects/ProjectDetailPage'));

/**
 * Main App Component
 * 
 * Sets up routing and provides the app shell
 */
const App: React.FC = () => {
  // Loading fallback component
  const LoadingFallback = () => (
    <div 
      className="flex items-center justify-center h-screen w-full"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="storyforge-theme">
            <UIProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <Dashboard />
                        </React.Suspense>
                      } />
                      <Route path="projects" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <Projects />
                        </React.Suspense>
                      } />
                      <Route path="projects/new" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <CreateProject />
                        </React.Suspense>
                      } />
                      <Route path="projects/:id" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <ProjectDetail />
                        </React.Suspense>
                      } />
                      <Route path="projects/:id/edit" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <ProjectDetail initialTab="edit" />
                        </React.Suspense>
                      } />
                      <Route path="projects/:id/settings" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <ProjectDetail initialTab="settings" />
                        </React.Suspense>
                      } />
                      <Route path="projects/:id/share" element={
                        <React.Suspense fallback={<LoadingFallback />}>
                          <ProjectDetail initialTab="share" />
                        </React.Suspense>
                      } />
                      
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
                  </Route>
                </Routes>
                <Toaster position="top-right" />
              </Router>
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
