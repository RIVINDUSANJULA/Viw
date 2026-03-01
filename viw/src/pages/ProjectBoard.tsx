// import NotFound from "./notFound";
import KanbanBoard from "../features/components/KanbanBoard";

import { useTenant } from "../context/TenantContext";
import { useState } from "react";
import { createTask } from "../features/api/kanbanApi";
import Modal from "../components/ui/Modal";

export default function ProjectBoard() {
  const { activeTenant } = useTenant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //FORCE Kanban - Refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant || !newTaskContent.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask(activeTenant.id, "todo", newTaskContent); 
      
      setNewTaskContent("");
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Tell the board to refetch
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating task. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div>
        <div>
          {activeTenant?.name}
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
        >
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
      

    </div>
  )
}
