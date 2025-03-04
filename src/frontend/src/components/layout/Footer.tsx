export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} StoryForge. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Help
          </a>
        </div>
      </div>
    </footer>
  );
} 