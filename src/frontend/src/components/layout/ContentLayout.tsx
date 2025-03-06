import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { BreadcrumbComponent } from '../ui/breadcrumb';

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: {
    label: string;
    href: string;
    isCurrent?: boolean;
  }[];
  actions?: ReactNode;
  isLoading?: boolean;
}

/**
 * ContentLayout component
 * 
 * Provides a consistent layout structure for content pages with breadcrumbs,
 * title, description, and actions.
 */
const ContentLayout: React.FC<ContentLayoutProps> = ({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  isLoading = false,
}) => {
  return (
    <div className="w-full p-4 sm:p-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <BreadcrumbComponent items={breadcrumbs} />
        </div>
      )}

      {/* Header with title, description and actions */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {/* Main content with loading state */}
      <div className="rounded-lg bg-card text-card-foreground">
        {isLoading ? (
          <div className="h-full w-full min-h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLayout; 