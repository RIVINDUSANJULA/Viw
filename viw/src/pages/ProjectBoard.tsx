import { useParams } from "react-router-dom"
import {projects} from "../components/Data";
import NotFound from "./notFound";
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
      {project.tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.status}</p>
        </div>
      ))}
    </div>
  )
}
