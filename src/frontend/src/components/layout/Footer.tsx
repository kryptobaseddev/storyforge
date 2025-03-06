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
    <footer className="bg-background border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © {currentYear} StoryForge. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-center text-muted-foreground/70">
          Version 0.1.0 - Beta
        </div>
      </div>
    </footer>
  );
};

export default Footer; 