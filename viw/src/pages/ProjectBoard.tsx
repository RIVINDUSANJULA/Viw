import { useState } from "react";
import KanbanBoard from "../features/components/KanbanBoard";
import { useTenant } from "../context/TenantContext";
import { createTask } from "../features/api/kanbanApi";
import Modal from "../components/ui/Modal";
import { supabase } from "../lib/supabase";
import InviteTeamModal from "../components/ui/InviteTeamModal";

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

  // console.log(refreshTrigger)
  
  return (
    <div>
      <div>
        <div>
          <h2>{activeTenant?.name || "Loading..."}</h2>
          
          {/* Only show dropdown if they belong to more than 1 workspace */}
          {availableTenants.length > 1 && (
            <select 
              value={activeTenant?.id || ""}
              onChange={(e) => {
                const selected = availableTenants.find(t => t.id === e.target.value);
                if (selected) setActiveTenant(selected);
              }}
            >
              {availableTenants.map((tenant) => (
                
                <option key={tenant.id} value={tenant.id}>
                  Switch to: {tenant.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <button onClick={() => setIsInviteModalOpen(true)}>
            Invite Member
        </button>
        <button onClick={() => setIsModalOpen(true)}>
          Create Task
        </button>
      </div>

      <div>
        <KanbanBoard key={refreshTrigger} /> 
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask}>
          <div>
            <label>Task Description</label>
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Create Task"}
            </button>
          </div>
        </form>
      </Modal>
      <InviteTeamModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}