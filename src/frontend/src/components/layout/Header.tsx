import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { Button } from '../ui/button';
import { 
  Menu, 
  Moon, 
  Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Header Component
 * 
 * Application header with logo, navigation and user controls
 */
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme } = useUI();
  const { user } = useAuth();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header 
      className="border-b border-solid sticky top-0 z-40 h-16 w-full"
      style={{ 
        backgroundColor: 'hsl(var(--background))', 
        borderColor: 'hsl(var(--border))' 
      }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">StoryForge</span>
          </Link>
        </div>
        
        {/* Navigation - Will be expanded in the future */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
        </nav>
        
        {/* User menu and actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* User avatar */}
          <Button 
            variant="outline" 
            size="icon" 
            className="relative w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
          >
            <span className="font-medium text-sm">{getUserInitials()}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 