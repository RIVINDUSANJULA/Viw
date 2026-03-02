import type { ColumnType, Task } from "../../types/types";
import TaskCard from "./TaskCard";
interface Props {
  column: ColumnType;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDelete: (taskId: string) => void;
}

export default function Column({ column, tasks, onDragStart, onDrop, onDragOver, onDelete }: Props) {

  return (
    <div onDrop={(e) => onDrop(e, column.id)} onDragOver={onDragOver}>
        <div>{column.title}</div>
        <div>{tasks.length}</div>
        <div>
          
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDragStart={onDragStart} onDelete={onDelete} />
          ))}

        </div>
    </div>
  )
}
