import KanbanBoard from "../features/components/KanbanBoard";
import { useTenant } from "../context/TenantContext";
import { useState, useEffect } from "react";
import { createTask, fetchColumns } from "../features/api/kanbanApi";
import { type Column, type Task } from "../types/types";
import Modal from "../components/ui/Modal";

export default function ProjectBoard() {
  const { activeTenant } = useTenant();

  // State for Modal and Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [columns, setColumns] = useState<Column[]>([]);
  const [, setTasks] = useState<Task[]>([]); // Used if you manage tasks here
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load columns on mount so we have a target for the new task
  useEffect(() => {
    if (activeTenant?.id) {
      fetchColumns(activeTenant.id).then(setColumns).catch(console.error);
    }
  }, [activeTenant]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    if (!activeTenant || !newTaskContent.trim()) return;

    try {
      setIsSubmitting(true);

      // 1. Find the first column as a default
      const targetColumnId = columns[0]?.id;

      if (!targetColumnId) {
        throw new Error("No columns found. Please create board columns first.");
      }

      // 2. Call the API
      const newTask = await createTask(activeTenant.id, targetColumnId, newTaskContent);

      // 3. Success! Update local state
      setTasks(prev => [...prev, newTask]);
      
      // 4. Force KanbanBoard to reload fresh data
      setRefreshTrigger(prev => prev + 1);

      // 5. Cleanup
      setNewTaskContent("");
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Failed to create task:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div>
        <h1>
          {activeTenant?.name || "Loading Workspace..."}
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
        >
          Create Task
        </button>
      </div>

      <div>
        {/* The key={refreshTrigger} forces the board to re-mount when a task is added */}
        <KanbanBoard key={refreshTrigger} /> 
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} >
          <div>
            <label >Task Description</label>
            <textarea
              rows={4}
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
  );
}