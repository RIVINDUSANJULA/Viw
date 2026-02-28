import type { Project } from "../types/types";

export const projects: Project[] = [
  {
    id: "1",
    name: "AI Research",
    description: "Building ML models",
    tasks: [
      { id: "t1", title: "Literature Review", status: "to-do" },
      { id: "t2", title: "Revieweeeee", status: "working" },
    ],
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Productivity application",
    tasks: [],
  },
];