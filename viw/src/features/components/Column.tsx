import type { ColumnType, Task, WorkspaceMember } from "../../types/types";
import TaskCard from "./TaskCard";
interface Props {
  column: ColumnType;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDelete: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  members: WorkspaceMember[];
}

export default function Column({ column, tasks, onDragStart, onDrop, onDragOver, onDelete, onTaskClick, members }: Props) {

  return (
    <div onDrop={(e) => onDrop(e, column.id)} onDragOver={onDragOver}>
        <div>{column.title}</div>
        <div>{tasks.length}</div>
        <div>
          
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDragStart={onDragStart} onDelete={onDelete} onClick={onTaskClick} members={members} />
          ))}

        </div>
    </div>
  )
}
