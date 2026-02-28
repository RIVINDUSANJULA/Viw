import type { Task } from "../../types/types"
import Column from "./Column";

import { useState } from "react";
import { defaultCols, defaultTasks } from "../data/constants";


export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id.toString());
  };

  const handleDrop = (e: React.DragEvent, columnId: string | number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, columnId: String(columnId) } : task
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };
  return (
    <div>
      {defaultCols.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((task) => task.columnId === col.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      ))}
    </div>
  )
}
