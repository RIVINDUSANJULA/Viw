import { type Column } from "../../types/types";

export const defaultCols: Column[] = [
  {
    id: "todo", title: "To Do",
    tenant_id: "",
    position_index: 0
  },
  {
    id: "in-progress", title: "In Progress",
    tenant_id: "",
    position_index: 0
  },
  {
    id: "review", title: "Code Review",
    tenant_id: "",
    position_index: 0
  },
  {
    id: "done", title: "Done",
    tenant_id: "",
    position_index: 0
  },
];

// export const defaultTasks: Task[] = [
//   { id: "1", columnId: "todo", content: "Set up Vite + SWC project architecture" },
//   { id: "2", columnId: "todo", content: "Configure global Tailwind CSS" },
//   { id: "3", columnId: "in-progress", content: "Implement feature-based folder structure" },
//   { id: "4", columnId: "review", content: "Review React Context for multi-tenancy" },
//   { id: "5", columnId: "done", content: "Define strict TypeScript interfaces" },
// ];