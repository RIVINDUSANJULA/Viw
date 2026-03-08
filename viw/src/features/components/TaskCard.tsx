import type { Task, WorkspaceMember } from '../../types/types';


interface Props {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
  members: WorkspaceMember[];
}
export default function TaskCard({ task, onDragStart, onDelete, onClick , members}: Props) {

  const assignedPerson = members.find(m => m.user_id === task.assignee_id);


  return (
    <div draggable onDragStart={(e) => onDragStart(e, task)} onClick={() => onClick(task)} className="cursor-grab">
      <div className="whitespace-pre-wrap">
        {task.title}
      </div>

      <div>
        {assignedPerson ? (<div>Assigned {assignedPerson.email?.split('@')[0]} </div>) : (<div>Unassigned</div>)}
      </div>


      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the drag event from firing
          onDelete(task.id);
          onClick=() => onClick(task)
          
        }}
        title="Delete Task">
        ✕
      </button>



    </div>
  )
}
