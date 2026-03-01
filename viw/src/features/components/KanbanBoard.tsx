import type { ColumnType, Task } from "../../types/types"
import Column from "./Column";

import { useEffect, useState } from "react";

//import { defaultCols, defaultTasks } from "../data/constants"; - Remove With New Supabase Algo

import { useTenant } from "../../context/TenantContext";
import { fetchColumns, fetchTasks, updateTaskColumn } from "../api/kanbanApi";


export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { activeTenant } = useTenant();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);


  //Supabase
  useEffect(() => {
    if (!activeTenant) return;

    const loadBoardData = async () => {
      setLoading(true);
      try {
        const [fetchedColumns, fetchedTasks] = await Promise.all([
          fetchColumns(activeTenant.id),
          fetchTasks(activeTenant.id)
        ]);
        setColumns(fetchedColumns);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error loading board data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, [activeTenant]);


  

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id.toString());
  };

  const handleDrop = async (e: React.DragEvent, columnId: string | number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, columnId: String(columnId) } : task
      )
    );


    //Supabase
    try {
      await updateTaskColumn(taskId, columnId);
    } catch (error) {
      console.error("Failed to update task in database:", error);
    }


  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  //Supabase - Just added a Loading
  if (loading) {
    return <div>Loading board...</div>;
  }


  return (
    <div>
      {columns.map((col) => (
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
