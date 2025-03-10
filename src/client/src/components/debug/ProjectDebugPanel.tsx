import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProjectWithDetails } from "@/context/ProjectContext";
import { RefreshCw, XCircle, Database, Bug } from "lucide-react";

interface ProjectDebugPanelProps {
  projects: any[];
  currentProject: ProjectWithDetails | null;
  onClose: () => void;
  onRefreshProjects: () => void;
  onForceSelectProject: (projectId: number) => void;
  isRefreshing?: boolean;
}

export function ProjectDebugPanel({
  projects,
  currentProject,
  onClose,
  onRefreshProjects,
  onForceSelectProject,
  isRefreshing = false,
}: ProjectDebugPanelProps) {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const handleCheckDatabase = async () => {
    try {
      // Directly check database connection
      const response = await fetch("/api/debug/db-status");
      const data = await response.json();
      
      toast({
        title: data.success ? "Database Connected" : "Database Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Database Check Failed",
        description: "Could not perform database connectivity check",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Bug className="text-amber-500 mr-2 h-5 w-5" />
          <h3 className="text-amber-500 font-bold">Debug Console</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshProjects}
            disabled={isRefreshing}
            className="h-7 text-xs bg-gray-800 border-gray-600"
          >
            {isRefreshing ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckDatabase}
            className="h-7 text-xs bg-gray-800 border-gray-600"
          >
            <Database className="h-3 w-3 mr-1" />
            Check DB
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs bg-gray-800 border-gray-600"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Close
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {/* Overview Panel */}
        <div className="bg-gray-800 rounded-md p-3">
          <button
            className="w-full flex justify-between items-center text-left"
            onClick={() => setExpandedSection(expandedSection === "overview" ? null : "overview")}
          >
            <span className="font-medium text-gray-300">System Overview</span>
            <span className="text-gray-500 text-xs">
              {expandedSection === "overview" ? "▼" : "▶"}
            </span>
          </button>
          
          {expandedSection === "overview" && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Projects Loaded:</div>
                <div className="text-white font-mono">{projects?.length || 0}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Current Project:</div>
                <div className="text-white font-mono">{currentProject?.name || "None"}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Current Project ID:</div>
                <div className="text-white font-mono">{currentProject?.id || "None"}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-gray-400">Characters:</div>
                <div className="text-white font-mono">{currentProject?.characters?.length || 0}</div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Details Panel */}
        <div className="bg-gray-800 rounded-md p-3">
          <button
            className="w-full flex justify-between items-center text-left"
            onClick={() => setExpandedSection(expandedSection === "projects" ? null : "projects")}
          >
            <span className="font-medium text-gray-300">Available Projects</span>
            <span className="text-gray-500 text-xs">
              {expandedSection === "projects" ? "▼" : "▶"}
            </span>
          </button>
          
          {expandedSection === "projects" && (
            <div className="mt-2">
              {projects && projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                      <div className="flex items-center">
                        <div 
                          className={`w-6 h-6 rounded-full ${project.coverColor || "bg-primary"} flex items-center justify-center mr-2`}
                        >
                          <span className="text-xs font-semibold">{project.coverInitial || "P"}</span>
                        </div>
                        <div className="text-xs">
                          <div className="text-white">{project.name}</div>
                          <div className="text-gray-400 text-[10px]">ID: {project.id}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onForceSelectProject(project.id)}
                        className="h-6 text-[10px] hover:bg-gray-600"
                      >
                        Force Select
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-xs p-2">No projects available</div>
              )}
            </div>
          )}
        </div>

        {/* Current Project Raw Data */}
        <div className="bg-gray-800 rounded-md p-3">
          <button
            className="w-full flex justify-between items-center text-left"
            onClick={() => setExpandedSection(expandedSection === "rawdata" ? null : "rawdata")}
          >
            <span className="font-medium text-gray-300">Raw Project Data</span>
            <span className="text-gray-500 text-xs">
              {expandedSection === "rawdata" ? "▼" : "▶"}
            </span>
          </button>
          
          {expandedSection === "rawdata" && (
            <div className="mt-2 overflow-auto max-h-60">
              <pre className="text-[10px] bg-gray-900 p-2 rounded text-green-400 whitespace-pre-wrap">
                {currentProject ? JSON.stringify(currentProject, null, 2) : "No project selected"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}