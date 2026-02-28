import { useParams } from "react-router-dom"
import {projects} from "../features/data/Data";
import NotFound from "./notFound";
import KanbanBoard from "../features/components/KanbanBoard";
// import Projects from "./Projects";
// import KanbanBoard from "../components/KanbanBoard";

export default function ProjectBoard() {
  const { id } = useParams();
  const project = projects.find((p) => (p.id) == id);
  // const task = project.tasks.map((x) => ({Tid : x.id, Ttitle : x.title , TStatus: x.status}));

  if (!project) {
    return <NotFound />;
  }
  
  
  return (
    <div>
      <h1>{project.name}</h1>
      <KanbanBoard tasks={project.tasks} />
    </div>
  )
}
