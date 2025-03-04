import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * MainLayout component
 * 
 * This component provides the main layout structure for the application,
 * including the header, sidebar, main content area, and footer.
 */
const MainLayout: React.FC = () => {
  // State for sidebar visibility (could be moved to context in the future)
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout; 