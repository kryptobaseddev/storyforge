import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectService } from '../../hooks/useProjectService';
import { getErrorMessage } from '../../utils/errorHandler';
import { Search, Plus } from 'lucide-react';
import ContentLayout from '../../components/layout/ContentLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import type { Project } from '@/schemas';

/**
 * Projects Page
 * 
 * Lists all projects with filtering, sorting, and search
 */
const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Use the project service hook to fetch projects
  const { getAllProjects, prefetchProject } = useProjectService();
  const { data: projectsData, isLoading, error } = getAllProjects();
  
  // Handle project hover to prefetch data
  const handleProjectHover = (projectId: string) => {
    prefetchProject(projectId);
  };
  
  // Filter projects based on search term and filters
  const filteredProjects = React.useMemo(() => {
    if (!projectsData) return [];
    
    return projectsData.filter((project) => {
      // Type guard to ensure project is Project type
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesGenre = genreFilter === '' || 
        (project.genre && project.genre.toLowerCase() === genreFilter.toLowerCase());
      
      const matchesStatus = statusFilter === '' || 
        (project.status && project.status.toLowerCase() === statusFilter.toLowerCase());
      
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [projectsData, searchTerm, genreFilter, statusFilter]);

  // Define breadcrumbs for navigation
  const breadcrumbs = [
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'Projects',
      href: '/projects'
    }
  ];

  // Error handling content
  if (error) {
    return (
      <ContentLayout
        title="My Projects"
        description="Manage your writing projects"
        breadcrumbs={breadcrumbs}
        actions={
          <Button onClick={() => navigate('/projects/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        }
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-destructive">Error loading projects</h3>
            <p className="mt-2 text-sm text-destructive/80">{getErrorMessage(error)}</p>
            <Button 
              variant="outline" 
              className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="My Projects"
      description="Manage your writing projects"
      breadcrumbs={breadcrumbs}
      actions={
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      }
      isLoading={isLoading}
    >
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select 
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Genres</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="mystery">Mystery</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            // Type assertion to ensure project has the correct type with progress property
            const typedProject = project as unknown as Project;
            
            return (
              <div 
                key={project.id} 
                className="bg-card text-card-foreground rounded-lg shadow overflow-hidden flex flex-col"
                onMouseEnter={() => handleProjectHover(project.id)}
              >
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {project.title}
                  </h2>
                  <div className="flex items-center mt-1 space-x-2">
                    {project.genre && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {project.genre}
                      </span>
                    )}
                    {project.status && (
                      <span className="inline-flex items-center rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description || 'No description provided.'}
                  </p>
                  
                  {typedProject.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium text-foreground">{typedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${typedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="border-t border-border p-4 bg-muted/50">
                  <div className="flex space-x-3">
                    <Button variant="secondary" className="flex-1" asChild>
                      <Link to={`/projects/${project.id}`}>
                        Open
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/projects/${project.id}/edit`}>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-card text-card-foreground rounded-lg shadow">
            {searchTerm || genreFilter || statusFilter ? (
              <>
                <h3 className="text-lg font-medium text-foreground">No matching projects found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search filters</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first project to get started</p>
              </>
            )}
          </div>
        )}
        
        {/* New Project Card */}
        <div 
          className="bg-card text-card-foreground rounded-lg shadow overflow-hidden border-2 border-dashed border-border flex items-center justify-center p-6 min-h-[260px] cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={() => navigate('/projects/new')}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-foreground">Create a new project</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started on your next masterpiece</p>
            <div className="mt-4">
              <Button>
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ProjectsPage; 