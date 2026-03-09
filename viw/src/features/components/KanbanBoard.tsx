import type { ColumnType, Task, WorkspaceMember } from "../../types/types"
import Column from "./Column";

import { useEffect, useState } from "react";


import { useTenant } from "../../context/TenantContext";
import { deleteTask, fetchColumns, fetchTasks, fetchWorkspaceMembers, updateTaskColumn , assignTaskToUser } from "../api/kanbanApi";
import EditTaskModal from "../../components/ui/EditTaskModal";
import Modal from "../../components/ui/Modal";
import { supabase } from "../../lib/supabase";


export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { activeTenant } = useTenant();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const handleTaskClick = (task: Task) => {
    // console.log("Task Clicked:", task.title);
    setSelectedTask(task);
  };


  //Supabase
  useEffect(() => {
    if (!activeTenant) return;

    // Data Loading Code Below


    const loadBoardData = async () => {
      setLoading(true);
      try {
        const [fetchedColumns, fetchedTasks, fetchedMembers] = await Promise.all([
          fetchColumns(activeTenant.id),
          fetchTasks(activeTenant.id),
          fetchWorkspaceMembers(activeTenant.id)
        ]);        
        setColumns(fetchedColumns);
        setTasks(fetchedTasks);
        setMembers(fetchedMembers);


          
        } catch (error) {
          console.error("Error loading board data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadBoardData();





    //Real Time Code Below

      const channel = supabase
      .channel(`tasks-sync-${activeTenant.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `tenant_id=eq.${activeTenant.id}`,
        },
        (payload) => {
          console.log(payload);

          if (payload.eventType === 'INSERT') {
            setTasks((prevTasks) => {
              if (prevTasks.some(t => t.id === payload.new.id)) return prevTasks;
              return [...prevTasks, payload.new as Task];
            });
          } 
          
          else if (payload.eventType === 'UPDATE') {
            setTasks((prevTasks) => 
              prevTasks.map((task) => 
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            );
          } 
          
          else if (payload.eventType === 'DELETE') {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };



      
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




  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAssigneeChange = async (taskId: string, userId: string) => {
    const newAssigneeId = userId === "unassigned" ? null : userId;
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignee_id: newAssigneeId } : t));
    
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, assignee_id: newAssigneeId });
    }

    try {
      await assignTaskToUser(taskId, newAssigneeId);
    } catch (err) {
      console.error("Failed to assign user", err);
      alert("Failed to assign user.");
    }
  };


  return (
    <div>
      {/* {activeTenant?.id == } */}
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((task) => task.column_id === col.id && task.tenant_id === activeTenant?.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDelete={handleDelete}

          onTaskClick={handleTaskClick}
          members={members}
          
        />
      ))}

      {/* {columns.map((col) => (
        <h1>${col.title}</h1>
      ))} */}

      <EditTaskModal 
        isOpen={!!editingTask} 
        onClose={() => setEditingTask(null)} 
        task={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />




      
      {selectedTask && (
        <Modal 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
          title="Task Details"
        >
          <button
            onClick={() => setSelectedTask(null)}
          >
            X
          </button>
          <div>
            <div>{selectedTask.title}</div>
            <div>Status: {selectedTask.column_id}</div>

            <div>
              <label>
                Assigned To:
              </label>
              <select
                value={selectedTask.assignee_id || "unassigned"}
                onChange={(e) => handleAssigneeChange(selectedTask.id, e.target.value)}
              >
                <option value="unassigned">Unassigned</option>
                {members.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.email} ({member.role})
                  </option>
                ))}
              </select>
            </div>


            <button>
              Delete Task
            </button>
          </div>
        </Modal>
      )}
       

      
    </div>
  )
}
