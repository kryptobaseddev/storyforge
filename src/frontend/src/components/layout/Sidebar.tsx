import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * 
 * Primary navigation sidebar for the application
 */
interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  // Define main navigation items
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid' },
    { path: '/projects', label: 'Projects', icon: 'folder' },
  ];
  
  // Define project tools when in a project context
  const projectTools = [
    { path: '/project/characters', label: 'Characters', icon: 'users' },
    { path: '/project/settings', label: 'Settings', icon: 'map' },
    { path: '/project/plots', label: 'Plots', icon: 'git-branch' },
    { path: '/project/chapters', label: 'Chapters', icon: 'book-open' },
    { path: '/project/exports', label: 'Exports', icon: 'download' },
  ];

  // Function to render icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'grid':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        );
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case 'map':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        );
      case 'git-branch':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
        );
      case 'book-open':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      case 'download':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  // Determine if we're in a project context (for future use)
  const isProjectContext = location.pathname.includes('/project/');

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 pt-16 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto px-4 py-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium ${
                location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="flex-shrink-0 text-slate-500 dark:text-slate-400">
                {renderIcon(item.icon)}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {isProjectContext && (
          <>
            <div className="mt-8 mb-2">
              <p className="px-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                PROJECT TOOLS
              </p>
            </div>
            <nav className="space-y-1">
              {projectTools.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="flex-shrink-0 text-slate-500 dark:text-slate-400">
                    {renderIcon(item.icon)}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 