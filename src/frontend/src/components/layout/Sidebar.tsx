import { Home, BookOpen, Users, Settings, PenTool, Map } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <NavItem icon={<Home size={20} />} href="/dashboard">
              Dashboard
            </NavItem>
            <NavItem icon={<BookOpen size={20} />} href="/projects">
              My Stories
            </NavItem>
            <NavItem icon={<Users size={20} />} href="/characters">
              Characters
            </NavItem>
            <NavItem icon={<Map size={20} />} href="/settings">
              Settings
            </NavItem>
            <NavItem icon={<PenTool size={20} />} href="/editor">
              Story Editor
            </NavItem>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            <NavItem icon={<Settings size={20} />} href="/profile">
              Profile
            </NavItem>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}

function NavItem({ icon, href, children }: NavItemProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
} 