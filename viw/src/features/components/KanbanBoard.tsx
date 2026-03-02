import type { ColumnType, Task } from "../../types/types"
import Column from "./Column";

import { useEffect, useState } from "react";


import { useTenant } from "../../context/TenantContext";
import { deleteTask, fetchColumns, fetchTasks, updateTaskColumn } from "../api/kanbanApi";


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
    e.dataTransfer.setData("taskId", task.id);
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"; 
  };



  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, column_id: columnId } : task
      )
    );


    //Supabase
    const performUpdate = async () => {
      try {
        await updateTaskColumn(taskId, columnId);
    } catch (error) {
        console.error("Failed to update task in database:", error);
        alert("Failed to move task. Reverting...");}

      if (activeTenant) {
        const refreshedTasks = await fetchTasks(activeTenant.id);
        setTasks(refreshedTasks);
      }


    }


    performUpdate();


  };



  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Reverting...");
      
      if (activeTenant) {
        const refreshedTasks = await fetchTasks(activeTenant.id);
        setTasks(refreshedTasks);
      }
    }
  };



  //Supabase - Just added a Loading
  if (loading) {
    return <div>Loading board...</div>;
  }


  if (!columns.length) return <div>No columns found.</div>;


  return (
    <div>
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((task) => task.column_id === col.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
