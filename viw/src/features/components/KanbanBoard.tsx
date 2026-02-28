import type { Task } from "../../types/types"
import Column from "./Column";

interface Props {
  tasks: Task[];
}

export default function KanbanBoard({ tasks }: Props) {
  return (
    <div>
      <Column title="To Do" status="to-do" tasks={tasks} />
      <Column title="Working" status="working" tasks={tasks} />
      <Column title="Completed" status="completed" tasks={tasks} />
    </div>
  )
}
