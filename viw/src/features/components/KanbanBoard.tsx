import type { ColumnType, Task, WorkspaceMember, StorageFile } from "../../types/types"
import Column from "./Column";

import { useEffect, useState } from "react";


import { useTenant } from "../../context/TenantContext";
import { deleteTask, fetchColumns, fetchTasks, fetchWorkspaceMembers, updateTaskColumn , assignTaskToUser, uploadTaskAttachment, getFilePublicUrl, fetchStorageFiles } from "../api/kanbanApi";
import EditTaskModal from "../../components/ui/EditTaskModal";
import Modal from "../../components/ui/Modal";
import { supabase } from "../../lib/supabase";
import { FileText, FolderOpen, Loader2, Trash2, X } from "lucide-react";


export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { activeTenant } = useTenant();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [members, setMembers] = useState<WorkspaceMember[]>([]);



  const [isUploading, setIsUploading] = useState(false);

  const [availableFiles, setAvailableFiles] = useState<StorageFile[]>([]);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [showFileLibrary, setShowFileLibrary] = useState(false);




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
          // console.log(payload);

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



  const handleFileUpload = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  try {
    const newUrl = await uploadTaskAttachment(taskId, file);
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, attachment_url: newUrl } : t));
    
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, attachment_url: newUrl });
    }
  } catch (error) {
    console.error(error);
    alert("Failed to upload file.");
  } finally {
    setIsUploading(false);
  }
};


const loadFileLibrary = async () => {
  setIsFetchingFiles(true);
  setShowFileLibrary(true);
  try {
    const files = await fetchStorageFiles();
    setAvailableFiles(files);
  } catch (error) {
    console.error(error);
  } finally {
    setIsFetchingFiles(false);
  }
};

const handleSelectExistingFile = async (taskId: string, fileName: string) => {
  const publicUrl = getFilePublicUrl(fileName);
  

  setTasks(prev => prev.map(t => t.id === taskId ? { ...t, attachment_url: publicUrl } : t));
  if (selectedTask) {
    setSelectedTask({ ...selectedTask, attachment_url: publicUrl });
  }


  try {
    const { error } = await supabase
      .from('tasks')
      .update({ attachment_url: publicUrl })
      .eq('id', taskId);
      
    if (error) throw error;
    setShowFileLibrary(false);
  } catch (err) {
    console.error("Failed to link file", err);
  }
};


  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-8rem)]">
      {/* {activeTenant?.id == } */}
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((task) => task.column_id === col.id && task.tenant_id === activeTenant?.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          // onDelete={handleDelete}

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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Modal 
            isOpen={!!selectedTask} 
            onClose={() => setSelectedTask(null)} 
            title="Task Details"
          >
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            
            <div className="space-y-6">
              <div className="text-xl font-semibold text-foreground">{selectedTask.title}</div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Assigned To:
                </label>
                <select
                  value={selectedTask.assignee_id || "unassigned"}
                  onChange={(e) => handleAssigneeChange(selectedTask.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                >
                  <option value="unassigned">Unassigned</option>
                  {members.map(member => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.email} ({member.role})
                    </option>
                  ))}
                </select>
              </div>




                <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Task Attachment
                </label>
                
                {selectedTask.attachment_url ? (
                  <div className="space-y-3">
                    <img 
                      src={selectedTask.attachment_url} 
                      alt="Task attachment" 
                      className="w-full max-h-48 object-cover rounded-lg border border-border"
                    />
                    <a 
                      href={selectedTask.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Open File
                    </a>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No attachment linked.</div>
                )}

                {/* The File Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload(selectedTask.id, e)}
                    disabled={isUploading}
                    className="sr-only"
                  />
                  <button 
                    onClick={loadFileLibrary}
                    className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Choose from Storage
                  </button>
                </div>
                {isUploading && <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading to Cloud...
                </span>}

                {/* The File Library Drawer */}
                {showFileLibrary && (
                  <div className="mt-4 rounded-lg border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                      <span className="text-sm font-medium text-foreground">Your Cloud Storage</span>
                      
                      
                      <button 
                        onClick={() => setShowFileLibrary(false)}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {isFetchingFiles ? (
                      <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">Loading files...</div>
                    ) : (
                      <div >
                        {availableFiles.map((file) => (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted transition-colors"
                            key={file.id} 
                            onClick={() => handleSelectExistingFile(selectedTask.id, file.name)}
                            title={file.name}
                          >
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                        {availableFiles.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground italic">No files found.</div>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => handleDelete(selectedTask.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Modal>
        </div>
      )}
       

      
    </div>
  )
}
