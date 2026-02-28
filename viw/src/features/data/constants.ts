import { type Column, type Task } from "../../types/types";

export const defaultCols: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Code Review" },
  { id: "done", title: "Done" },
];

export const defaultTasks: Task[] = [
  { id: "1", columnId: "todo", content: "Set up Vite + SWC project architecture" },
  { id: "2", columnId: "todo", content: "Configure global Tailwind CSS" },
  { id: "3", columnId: "in-progress", content: "Implement feature-based folder structure" },
  { id: "4", columnId: "review", content: "Review React Context for multi-tenancy" },
  { id: "5", columnId: "done", content: "Define strict TypeScript interfaces" },
];