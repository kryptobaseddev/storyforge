import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

/**
 * Debug component to test context and rendering
 */
const DebugComponent: React.FC = () => {
  const { theme, setTheme, sidebarOpen, toggleSidebar } = useUI();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('DebugComponent mounted');
    console.log('UIContext values:', { theme, sidebarOpen });
    console.log('Auth values:', { isAuthenticated, user, isLoading });
    
    return () => {
      console.log('DebugComponent unmounted');
    };
  }, [theme, sidebarOpen, isAuthenticated, user, isLoading]);
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 p-4 border border-solid rounded-lg shadow-lg max-w-xs"
      style={{ 
        backgroundColor: 'hsl(var(--background))', 
        borderColor: 'hsl(var(--border))' 
      }}
    >
      <h3 className="font-bold mb-2 text-foreground">Debug Panel</h3>
      
      <div className="mb-4 text-xs text-muted-foreground">
        <p><strong>Theme:</strong> {theme}</p>
        <p><strong>Sidebar:</strong> {sidebarOpen ? 'Open' : 'Closed'}</p>
        <p><strong>Auth:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Loading' : 'Not Loading'}</p>
        <p><strong>User:</strong> {user ? user.username : 'No user'}</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          Toggle Theme
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={toggleSidebar}
        >
          Toggle Sidebar
        </Button>
      </div>
    </div>
  );
};

export default DebugComponent; 