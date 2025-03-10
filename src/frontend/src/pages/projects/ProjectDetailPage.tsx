import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectService } from '../../hooks/useProjectService';
import { useCharacterService } from '../../hooks/useCharacterService';
import { usePlotService } from '../../hooks/usePlotService';
import { useChapterService } from '../../hooks/useChapterService';
import ContentLayout from '../../components/layout/ContentLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  Edit, 
  Settings, 
  Share, 
  Users, 
  BookOpen, 
  Bookmark, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Project, Character, Plot, Chapter } from '../../schemas';

interface ProjectDetailPageProps {
  initialTab?: string;
}

/**
 * Project Detail Page
 * 
 * Shows detailed information about a project with tabs for different aspects
 */
const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ initialTab = 'overview' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Set active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Fetch project data
  const { getProject } = useProjectService();
  const { data: projectData, isLoading: projectLoading, error: projectError } = 
    getProject(id || '');
    
  // Type assertion for project data
  const project = projectData as unknown as Project & { 
    progress?: number;
    notes?: string;
  };
  
  // Fetch characters for this project
  const { getAllCharacters } = useCharacterService();
  const { data: charactersData, isLoading: charactersLoading } = 
    getAllCharacters(id || '');
    
  // Type assertion for characters data
  const characters = charactersData as unknown as Character[];
  
  // Fetch plots for this project
  const { getAllPlots } = usePlotService();
  const { data: plotsData, isLoading: plotsLoading } = 
    getAllPlots(id || '');
    
  // Type assertion for plots data
  const plots = plotsData as unknown as Plot[];
  
  // Fetch chapters for this project
  const { getAllChapters } = useChapterService();
  const { data: chaptersData, isLoading: chaptersLoading } = 
    getAllChapters(id || '');
    
  // Type assertion for chapters data
  const chapters = chaptersData as unknown as Chapter[];
  
  // Calculate project stats
  const stats = {
    characterCount: characters?.length || 0,
    plotCount: plots?.length || 0,
    chapterCount: chapters?.length || 0,
    wordCount: chapters?.reduce((total, chapter) => total + (chapter.wordCount || 0), 0) || 0
  };
  
  // Define breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: project?.title || 'Project Details', href: `/projects/${id}` }
  ];
  
  // Loading state
  const isLoading = projectLoading || charactersLoading || plotsLoading || chaptersLoading;
  
  // Error state
  if (projectError) {
    return (
      <ContentLayout
        title="Project Not Found"
        breadcrumbs={breadcrumbs.slice(0, 2)}
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-destructive mr-2" />
              <h3 className="text-lg font-medium text-destructive">Error loading project</h3>
            </div>
            <p className="mt-2 text-sm text-destructive/80">
              The project could not be found or you don't have permission to view it.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }
  
  return (
    <ContentLayout
      title={project?.title || 'Loading...'}
      description={project?.description || ''}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${id}/settings`)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${id}/share`)}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      }
      isLoading={isLoading}
    >
      {/* Project Tabs */}
      <Tabs 
        defaultValue={initialTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="plot">Plot</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Story Summary */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Story Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {project?.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
            
            {/* Status Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project?.progress || 0}%</span>
                    </div>
                    <Progress value={project?.progress || 0} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium">{project?.status || 'Draft'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Genre:</span>
                      <span className="ml-2 font-medium">{project?.genre || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Audience:</span>
                      <span className="ml-2 font-medium">{project?.targetAudience || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-medium">{project?.narrativeType || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Steps */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                <ul className="space-y-2 text-sm">
                  {stats.characterCount === 0 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>Create your first character</span>
                    </li>
                  )}
                  {stats.plotCount === 0 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>Outline your plot</span>
                    </li>
                  )}
                  {stats.chapterCount === 0 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>Write your first chapter</span>
                    </li>
                  )}
                  {stats.characterCount > 0 && stats.plotCount > 0 && stats.chapterCount > 0 && (
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span>Continue writing your story</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            {/* Notes */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {project?.notes || 'No notes yet. Add some notes to keep track of your ideas.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Characters Tab */}
        <TabsContent value="characters">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Characters</h2>
            <Button onClick={() => navigate(`/projects/${id}/characters/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              New Character
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters && characters.length > 0 ? (
              characters.map((character) => (
                <CharacterCard 
                  key={character.id} 
                  character={character} 
                  projectId={id || ''} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-card text-card-foreground rounded-lg shadow">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium text-foreground">No characters yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first character to get started</p>
                <Button className="mt-4" onClick={() => navigate(`/projects/${id}/characters/new`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Character
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Plot Tab */}
        <TabsContent value="plot">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Plot</h2>
            <Button onClick={() => navigate(`/projects/${id}/plots/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              New Plot
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plots && plots.length > 0 ? (
              plots.map((plot) => (
                <PlotCard 
                  key={plot.id} 
                  plot={plot} 
                  projectId={id || ''} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-card text-card-foreground rounded-lg shadow">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium text-foreground">No plots yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first plot to get started</p>
                <Button className="mt-4" onClick={() => navigate(`/projects/${id}/plots/new`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Plot
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Chapters Tab */}
        <TabsContent value="chapters">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chapters</h2>
            <Button onClick={() => navigate(`/projects/${id}/chapters/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              New Chapter
            </Button>
          </div>
          
          <div className="space-y-4">
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter) => (
                <ChapterCard 
                  key={chapter.id} 
                  chapter={chapter} 
                  projectId={id || ''} 
                />
              ))
            ) : (
              <div className="text-center py-12 bg-card text-card-foreground rounded-lg shadow">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium text-foreground">No chapters yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first chapter to get started</p>
                <Button className="mt-4" onClick={() => navigate(`/projects/${id}/chapters/new`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chapter
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Edit Tab */}
        <TabsContent value="edit">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Edit Project</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <input 
                    id="title"
                    type="text"
                    defaultValue={project?.title}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description"
                    defaultValue={project?.description}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="genre" className="text-sm font-medium">Genre</label>
                    <select 
                      id="genre"
                      defaultValue={project?.genre}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Genre</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="sci-fi">Science Fiction</option>
                      <option value="mystery">Mystery</option>
                      <option value="romance">Romance</option>
                      <option value="thriller">Thriller</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select 
                      id="status"
                      defaultValue={project?.status}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Project Settings</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Project Visibility</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isPublic" 
                      defaultChecked={project?.isPublic}
                    />
                    <label htmlFor="isPublic">Make project public</label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Public projects can be viewed by anyone with the link.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <Button variant="destructive">Delete Project</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Share Tab */}
        <TabsContent value="share">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Share Project</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Collaborators</h3>
                  <p className="text-sm text-muted-foreground">
                    Invite others to collaborate on this project.
                  </p>
                  <div className="flex mt-2">
                    <input 
                      type="email" 
                      placeholder="Enter email address"
                      className="flex-1 p-2 border rounded-l-md"
                    />
                    <Button className="rounded-l-none">Invite</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Share Link</h3>
                  <div className="flex">
                    <input 
                      type="text" 
                      readOnly
                      value={`${window.location.origin}/projects/${id}/view`}
                      className="flex-1 p-2 border rounded-l-md bg-muted"
                    />
                    <Button className="rounded-l-none">Copy</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};

// Helper component for character cards
interface CharacterCardProps {
  character: Character;
  projectId: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, projectId }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-muted flex items-center justify-center">
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <Users className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground">{character.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{character.role || 'No role specified'}</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {character.shortDescription || 'No description provided.'}
        </p>
        <Button variant="secondary" size="sm" className="w-full mt-3" asChild>
          <Link to={`/projects/${projectId}/characters/${character.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

// Helper component for plot cards
interface PlotCardProps {
  plot: Plot;
  projectId: string;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, projectId }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground">{plot.title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {plot.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted ml-2">
            {plot.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {plot.description || 'No description provided.'}
        </p>
        <Button variant="secondary" size="sm" className="w-full mt-3" asChild>
          <Link to={`/projects/${projectId}/plots/${plot.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

// Helper component for chapter cards
interface ChapterCardProps {
  chapter: Chapter;
  projectId: string;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, projectId }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground">
              Chapter {chapter.position + 1}: {chapter.title}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                {chapter.status}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {chapter.wordCount} words
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/projects/${projectId}/chapters/${chapter.id}`}>
              Edit
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {chapter.synopsis || 'No synopsis provided.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailPage; 