import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header Component
 * 
 * Application header with logo, navigation and user controls
 */
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">StoryForge</span>
          </Link>
        </div>
        
        {/* Navigation - Will be expanded in the future */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Dashboard
          </Link>
          <Link to="/projects" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Projects
          </Link>
        </nav>
        
        {/* User menu and actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle - placeholder for now */}
          <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          
          {/* User avatar/profile button - placeholder for now */}
          <button className="relative w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-500">
            <span className="font-medium text-sm">JD</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 