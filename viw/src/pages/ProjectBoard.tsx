import { useState } from "react";
import KanbanBoard from "../features/components/KanbanBoard";
import { useTenant } from "../context/TenantContext";
import { createTask } from "../features/api/kanbanApi";
// import Modal from "../components/ui/Modal";
import { supabase } from "../lib/supabase";
import InviteTeamModal from "../components/ui/InviteTeamModal";
import { useTheme } from "../context/ThemeContext";
import { ChevronDown, LogOut, Moon, Plus, Sun, UserPlus, X } from "lucide-react";

export default function ProjectBoard() {
  const { activeTenant, availableTenants, setActiveTenant } = useTenant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORCE Kanban Refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant || !newTaskContent.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask(activeTenant.id, newTaskContent); 
      setNewTaskContent("");
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating task. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };




  const handleLogout = async () => {
    await supabase.auth.signOut();
  };



  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background text-foreground">



      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">


          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {activeTenant?.name || "Loading..."}
            </h2>

            {/* Only show dropdown if they belong to more than 1 workspace */}
            {availableTenants.length > 1 && (
              <div className="relative">
                <select
                  value={activeTenant?.id || ""}
                  onChange={(e) => {
                    const selected = availableTenants.find(
                      (t) => t.id === e.target.value
                    );
                    if (selected) setActiveTenant(selected);
                  }}
                  className="appearance-none rounded-lg border border-border bg-secondary px-3 py-2 pr-8 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  {availableTenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
          </div>





          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>



            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Invite Member</span>
            </button>




            <button
              // onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <InviteTeamModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
              />
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Task</span>
            </button>
          </div>
        </div>
      </header>




      <main className="mx-auto w-full max-w-[100vw] flex-1 px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-80px)]">
        <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm overflow-hidden">
          <KanbanBoard key={refreshTrigger} />
        </div>
      </main>







      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-6 text-lg font-semibold">Create New Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="taskContent"
                  className="text-sm font-medium text-foreground"
                >
                  Task Description
                </label>
                <textarea
                  id="taskContent"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <InviteTeamModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />



      
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </footer>
    </div>
  );
}