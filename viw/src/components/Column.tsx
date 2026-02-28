import type { Task } from "../types/types";
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
            {task.title}
            <div>{task.status}</div>
            {task.id}
            
        </div>
        
      ))}
    </div>
  )
}
