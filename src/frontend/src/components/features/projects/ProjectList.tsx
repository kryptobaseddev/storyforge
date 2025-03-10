import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectService } from '@/hooks/useProjectService';
import { getErrorMessage } from '@/utils/errorHandler';
import type { Project } from '@/schemas';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { getAllProjects, deleteProject } = useProjectService();
  const { data: projectsData, isLoading, error } = getAllProjects();
  const deleteMutation = deleteProject();

  // Convert any Date objects to strings to match the Project interface
  const projects = React.useMemo(() => {
    if (!projectsData) return [];
    
    return projectsData.map(project => ({
      ...project,
      // Ensure dates are strings
      createdAt: typeof project.createdAt === 'string' 
        ? project.createdAt 
        : new Date(project.createdAt).toISOString(),
      updatedAt: typeof project.updatedAt === 'string' 
        ? project.updatedAt 
        : new Date(project.updatedAt).toISOString(),
      completionDate: project.completionDate 
        ? (typeof project.completionDate === 'string' 
            ? project.completionDate 
            : new Date(project.completionDate).toISOString())
        : null
    }));
  }, [projectsData]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50">
        Error loading projects: {getErrorMessage(error)}
      </div>
    );
  }

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteMutation.mutateAsync({ id: projectId });
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <button
          onClick={() => navigate('/projects/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Create New Project
        </button>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-gray-500 text-center p-8 border border-gray-200 rounded">
          No projects found. Create your first project!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <div key={project.id} className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex border-t px-4 py-3 bg-gray-50">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-indigo-600 hover:text-indigo-800 mr-4"
                >
                  Open
                </button>
                <button
                  onClick={() => navigate(`/projects/${project.id}/edit`)}
                  className="text-gray-600 hover:text-gray-800 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-800 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList; 