import React, { useState, useEffect } from 'react';
import ContentLayout from '../../components/layout/ContentLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectService } from '../../hooks/useProjectService';
import { Project } from '../../schemas';

/**
 * Dashboard Page
 * 
 * Main dashboard page showing recent projects and activities
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get projects using the project service
  const { getAllProjects } = useProjectService();
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = getAllProjects();
  
  // Set loading state based on projects loading
  useEffect(() => {
    if (!projectsLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [projectsLoading]);

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

  // Get recent projects (up to 3)
  const recentProjects = projectsData?.slice(0, 3) || [];

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
            {projectsError ? (
              <div className="col-span-full p-6 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <h3 className="text-lg font-medium text-destructive">Error loading projects</h3>
                <p className="text-sm text-destructive/80 mt-1">Please try again later</p>
              </div>
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project as unknown as Project}
                />
              ))
            ) : !isLoading && (
              <div className="col-span-full p-6 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
              </div>
            )}
            
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
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format the date safely
  const formattedDate = new Date(project.updatedAt || project.createdAt).toLocaleDateString();
  
  // Calculate progress (if available)
  const progress = project.progress || 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {project.description || 'No description provided.'}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary rounded-full h-2" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Last edited {formattedDate}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full" asChild>
          <Link to={`/projects/${project.id}`}>
            Open Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardPage; 