import type { Task } from "../types/types";
import TaskCard from "./TaskCard";
interface Props {
  title: string;
  status: Task["status"];
  tasks: Task[];
}

export default function Column({ status, tasks }: Props) {
    const filteredTasks = tasks.filter(
    task => task.status === status
  );
  return (
    <div>
        {filteredTasks.map(task => (
        <div>
            <br/>
            <TaskCard key={task.id} task={task}/>
            
        </div>
        
      ))}
    </div>
  )
}
