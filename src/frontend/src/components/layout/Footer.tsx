import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * 
 * Application footer with copyright and links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} StoryForge. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-center text-slate-400 dark:text-slate-500">
          Version 0.1.0 - Beta
        </div>
      </div>
    </footer>
  );
};

export default Footer; 