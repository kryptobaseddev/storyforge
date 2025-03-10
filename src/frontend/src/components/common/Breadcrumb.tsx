import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb component
 * 
 * Displays a breadcrumb navigation trail.
 * The last item is automatically styled as the current/active item.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center space-x-1">
        {/* Home link */}
        <li>
          <Link 
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        <li>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </li>
        
        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.label}>
              <li>
                {isLast || !item.href ? (
                  <span className={cn(
                    isLast ? "font-medium text-foreground" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.href} 
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              
              {!isLast && (
                <li>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 