import React from 'react';

/**
 * Dashboard Page
 * 
 * Main dashboard page showing recent projects and activities
 */
const DashboardPage: React.FC = () => {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome to your StoryForge dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Projects Card */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Recent Projects</h2>
          <div className="space-y-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Fantasy Novel</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last edited 2 days ago</p>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Sci-Fi Short Story</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last edited 1 week ago</p>
            </div>
            
            <button className="w-full mt-4 inline-flex items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
              View All Projects
            </button>
          </div>
        </div>
        
        {/* Activity Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Edited Chapter 3</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago · Fantasy Novel</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Created new character</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday · Sci-Fi Short Story</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Generated setting image</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">3 days ago · Fantasy Novel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 