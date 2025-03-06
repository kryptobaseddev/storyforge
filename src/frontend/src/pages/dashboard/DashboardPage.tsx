import React, { useState, useEffect } from 'react';
import ContentLayout from '../../components/layout/ContentLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dashboard Page
 * 
 * Main dashboard page showing recent projects and activities
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get the user's first name or username for personalized greeting
  const displayName = user?.firstName || user?.username || 'Writer';

  // Define breadcrumbs for navigation
  const breadcrumbs = [
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'Dashboard',
      href: '/dashboard'
    }
  ];

  return (
    <ContentLayout 
      title={`Welcome back, ${displayName}!`}
      description="Your writing dashboard"
      breadcrumbs={breadcrumbs}
      actions={
        <Button asChild>
          <Link to="/projects/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      }
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="mb-6 bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-bold mb-2 text-foreground">Ready to Create?</h2>
                <p className="text-muted-foreground mb-4">Continue your writing journey or start something new.</p>
              </div>
              <Button className="mt-2 md:mt-0" asChild>
                <Link to="/projects/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Projects Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Cards */}
            <ProjectCard 
              title="Fantasy Novel" 
              description="Epic fantasy set in a medieval world" 
              lastEdited="2 days ago"
              progress={45}
            />
            
            <ProjectCard 
              title="Sci-Fi Short Story" 
              description="Near-future technology exploration" 
              lastEdited="1 week ago"
              progress={78}
            />
            
            <ProjectCard 
              title="Mystery Thriller" 
              description="Small town murder mystery" 
              lastEdited="2 weeks ago"
              progress={23}
            />
            
            {/* Create New Project Card */}
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Create New Project</p>
                <p className="text-sm text-muted-foreground mb-4">Start something new</p>
                <Button variant="outline" asChild>
                  <Link to="/projects/new">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

// Helper component for project cards
interface ProjectCardProps {
  title: string;
  description: string;
  lastEdited: string;
  progress: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, lastEdited, progress }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary rounded-full h-2" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Last edited {lastEdited}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full" asChild>
          <Link to={`/projects/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            Open Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardPage; 