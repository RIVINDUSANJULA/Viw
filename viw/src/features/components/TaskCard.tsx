import type { Task } from '../../types/types';


interface Props {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}
export default function TaskCard({ task, onDragStart }: Props) {
  return (
    <div draggable onDragStart={(e) => onDragStart(e, task)} className="cursor-grab">
      <div className="whitespace-pre-wrap">
        {task.title}
      </div>
    </div>
  )
}
