import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen xl:grid-cols-[272px_1fr]">
        <Sidebar />
        <div className="flex min-w-0 flex-col">
          <Topbar />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}