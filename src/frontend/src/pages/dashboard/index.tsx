import { BookOpen, Plus } from "lucide-react";

export default function Dashboard() {
  // Mock data for projects
  const projects = [
    {
      id: 1,
      title: "The Dragon's Quest",
      description: "A young dragon embarks on a journey to find his family.",
      lastEdited: "2 days ago",
    },
    {
      id: 2,
      title: "Space Adventures",
      description: "Join Captain Zoe as she explores the galaxy.",
      lastEdited: "1 week ago",
    },
    {
      id: 3,
      title: "The Magical Forest",
      description: "Discover the secrets hidden within the ancient trees.",
      lastEdited: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Story
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    lastEdited: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex items-center pt-4">
          <span className="text-xs text-muted-foreground">
            Last edited: {project.lastEdited}
          </span>
        </div>
      </div>
      <div className="flex items-center p-6 pt-0">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Open
        </button>
        <button className="ml-2 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
          Edit
        </button>
      </div>
    </div>
  );
} 