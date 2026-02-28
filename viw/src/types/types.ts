export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}
export interface Task {
  id: string;
  // title: string;
  // status: "to-do" | "working" | "completed";

  // columnId: Id;
  columnId: string | number;
  content: string;
}

export type Id = string;
export interface Column {
  id: Id;
  title: string;
}

export interface ColumnType {
  id: string | number;
  title: string;
}