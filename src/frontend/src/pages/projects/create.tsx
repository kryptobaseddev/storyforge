import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectService } from '../../hooks/useProjectService';
import { getErrorMessage } from '../../utils/errorHandler';
import { AIAssistant } from '../../components/features/ai/AIAssistant';

// Define genres exactly as they are in the backend schema
type GenreType = 
  | 'fantasy'
  | 'science fiction'
  | 'mystery'
  | 'adventure'
  | 'historical fiction'
  | 'realistic fiction'
  | 'horror'
  | 'comedy'
  | 'drama'
  | 'fairy tale'
  | 'fable'
  | 'superhero';

// Define audience types
type TargetAudienceType = 'children' | 'middle grade' | 'young adult' | 'adult';

// Define narrative types
type NarrativeType = 'Short Story' | 'Novel' | 'Screenplay' | 'Comic' | 'Poem';

// Form data for frontend
interface ProjectFormData {
  title: string;
  description: string;
  genre: string;
  targetAudience: TargetAudienceType;
  narrativeType: NarrativeType;
  tone?: string;
  style?: string;
}

export default function CreateProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState<ProjectFormData>({
    title: '',
    description: '',
    genre: '',
    targetAudience: 'children',
    narrativeType: 'Novel',
  });

  // Use the project service hook
  const { createProject } = useProjectService();
  const createMutation = createProject();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  // Map UI genre values to backend genre values
  const mapGenreToBackendValue = (uiGenre: string): GenreType | undefined => {
    const genreMap: Record<string, GenreType> = {
      'fantasy': 'fantasy',
      'science-fiction': 'science fiction',
      'mystery': 'mystery',
      'adventure': 'adventure',
      'historical': 'historical fiction',
      'fairy-tale': 'fairy tale',
      'realistic': 'realistic fiction',
      'horror': 'horror',
      'comedy': 'comedy',
      'drama': 'drama',
      'fable': 'fable',
      'superhero': 'superhero',
    };
    
    return genreMap[uiGenre] as GenreType | undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert genre to backend value
      const backendGenre = mapGenreToBackendValue(project.genre);
      
      if (!backendGenre && project.genre) {
        throw new Error('Invalid genre selection');
      }

      await createMutation.mutateAsync({
        title: project.title,
        description: project.description,
        genre: backendGenre as GenreType, // Cast is safe because we validate above
        targetAudience: project.targetAudience,
        narrativeType: project.narrativeType,
      });
      
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(getErrorMessage(err) || 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIInsert = (content: string) => {
    // Determine where to insert the AI-generated content
    if (!project.description) {
      setProject((prev) => ({ ...prev, description: content }));
    } else {
      // If description already has content, append it
      setProject((prev) => ({
        ...prev,
        description: prev.description + '\n\n' + content,
      }));
    }
  };

  return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create New Story</h1>
          <p className="mt-2 text-muted-foreground">
            Set up your new story project with a title, description, and basic details.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-foreground"
                  >
                    Story Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={project.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter a title for your story"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe your story"
                  />
                </div>

                <div>
                  <label
                    htmlFor="genre"
                    className="block text-sm font-medium text-foreground"
                  >
                    Genre
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={project.genre}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a genre</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="science-fiction">Science Fiction</option>
                    <option value="mystery">Mystery</option>
                    <option value="adventure">Adventure</option>
                    <option value="historical">Historical Fiction</option>
                    <option value="realistic">Realistic Fiction</option>
                    <option value="horror">Horror</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="fairy-tale">Fairy Tale</option>
                    <option value="fable">Fable</option>
                    <option value="superhero">Superhero</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="targetAudience"
                    className="block text-sm font-medium text-foreground"
                  >
                    Target Audience
                  </label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    value={project.targetAudience}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="children">Children (Ages 5-8)</option>
                    <option value="middle grade">Middle Grade (Ages 9-12)</option>
                    <option value="young adult">Young Adult (Ages 13-17)</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="narrativeType"
                    className="block text-sm font-medium text-foreground"
                  >
                    Narrative Type
                  </label>
                  <select
                    id="narrativeType"
                    name="narrativeType"
                    value={project.narrativeType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Novel">Novel</option>
                    <option value="Short Story">Short Story</option>
                    <option value="Screenplay">Screenplay</option>
                    <option value="Comic">Comic</option>
                    <option value="Poem">Poem</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || createMutation.isLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading || createMutation.isLoading ? 'Creating...' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>

          <div>
            <AIAssistant onInsert={handleAIInsert} contextType="text" />
          </div>
        </div>
      </div>
  );
} 