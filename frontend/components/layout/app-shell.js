import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_12%,rgba(20,184,166,0.14),transparent_24%),radial-gradient(circle_at_85%_5%,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_15%_12%,rgba(20,184,166,0.12),transparent_24%),radial-gradient(circle_at_85%_5%,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <div className="grid min-h-screen xl:grid-cols-[286px_1fr]">
        <Sidebar />
        <div className="flex min-w-0 flex-col">
          <Topbar />
          <main className="flex-1 px-4 pb-8 pt-3 lg:px-8 lg:pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}