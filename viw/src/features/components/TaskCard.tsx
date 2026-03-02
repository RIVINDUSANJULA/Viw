import type { Task } from '../../types/types';


interface Props {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
}
export default function TaskCard({ task, onDragStart, onDelete, onClick}: Props) {
  return (
    <div draggable onDragStart={(e) => onDragStart(e, task)} onClick={() => onClick(task)} className="cursor-grab">
      <div className="whitespace-pre-wrap">
        {task.title}
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
