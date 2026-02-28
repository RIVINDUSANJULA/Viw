import type { Task } from "../types/types";

interface Props {
  task: Task;
}
export default function TaskCard({ task }: Props) {
  return (
    <div>{task.id}{task.title}{task.status}</div>
  )
}
