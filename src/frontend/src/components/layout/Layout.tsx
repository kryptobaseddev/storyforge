import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { cn } from "../../utils/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={() => {}}  />
      <div className="flex flex-1">
        <Sidebar isOpen={true} />
        <main className={cn("flex-1 p-6", className)}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
} 