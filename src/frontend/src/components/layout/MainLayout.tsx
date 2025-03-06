import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUI } from '../../context/UIContext';
import DebugComponent from '../common/DebugComponent';

/**
 * MainLayout component
 * 
 * This component provides the main layout structure for the application,
 * including the header, sidebar, and main content area.
 */
const MainLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <div style={{ width: sidebarOpen ? '16rem' : '3rem', flexShrink: 0 }}>
          <Sidebar isOpen={sidebarOpen} />
        </div>
        
        {/* Main Content Area - Takes remaining width */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Debug Component - only visible during development */}
      {process.env.NODE_ENV === 'development' && <DebugComponent />}
    </div>
  );
};

export default MainLayout; 