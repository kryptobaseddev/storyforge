import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Projects Page
 * 
 * Lists all projects with filtering, sorting, and search
 */
const ProjectsPage: React.FC = () => {
  // Placeholder project data
  const projects = [
    {
      id: '1',
      title: 'Fantasy Novel',
      description: 'An epic fantasy adventure set in a magical world.',
      genre: 'Fantasy',
      status: 'In Progress',
      lastEdited: '2 days ago',
      progress: 35
    },
    {
      id: '2',
      title: 'Sci-Fi Short Story',
      description: 'A short story about space exploration in the distant future.',
      genre: 'Science Fiction',
      status: 'Draft',
      lastEdited: '1 week ago',
      progress: 65
    },
    {
      id: '3',
      title: 'Mystery Thriller',
      description: 'A detective story set in a small coastal town.',
      genre: 'Mystery',
      status: 'Planning',
      lastEdited: '3 days ago',
      progress: 15
    }
  ];

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your writing projects</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </button>
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option value="">All Genres</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="mystery">Mystery</option>
          </select>
          
          <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
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
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {project.title}
              </h2>
              <div className="flex items-center mt-1 space-x-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {project.genre}
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {project.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {project.description}
              </p>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Last edited {project.lastEdited}
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
              <div className="flex space-x-3">
                <Link
                  to={`/projects/${project.id}`}
                  className="flex-1 inline-flex justify-center items-center rounded-md bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                >
                  Open
                </Link>
                <button className="inline-flex items-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* New Project Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-6 min-h-[260px]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Create a new project</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started on your next masterpiece</p>
            <div className="mt-4">
              <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage; 