import { useState, useEffect } from "react";
import type { Task } from "../../types/types";
import { updateTaskDetails } from "../../features/api/kanbanApi";
import Modal from "./Modal"; 
interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: (updatedTask: Task) => void;
}

export default function EditTaskModal({ isOpen, onClose, task, onTaskUpdated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setIsSaving(true);
    try {
      await updateTaskDetails(task.id, title, description);
      
      onTaskUpdated({ ...task, title, description });
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSave}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
          />
        </div>

        <div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}