import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { projectsApi, ProjectData } from '../../lib/api';
import { AIAssistant } from '../../components/features/ai/AIAssistant';

export default function CreateProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState<ProjectData>({
    title: '',
    description: '',
    genre: '',
    targetAudience: 'children',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await projectsApi.create(project);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
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
    <Layout>
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
                    <option value="adventure">Adventure</option>
                    <option value="mystery">Mystery</option>
                    <option value="science-fiction">Science Fiction</option>
                    <option value="historical">Historical</option>
                    <option value="fairy-tale">Fairy Tale</option>
                    <option value="other">Other</option>
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
                    <option value="middle-grade">Middle Grade (Ages 9-12)</option>
                    <option value="young-adult">Young Adult (Ages 13-17)</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>

          <div>
            <AIAssistant onInsert={handleAIInsert} contextType="text" />
          </div>
        </div>
      </div>
    </Layout>
  );
} 