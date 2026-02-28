import { useParams } from "react-router-dom"
// import Projects from "./Projects";
// import KanbanBoard from "../components/KanbanBoard";

export default function ProjectBoard() {
  const {id} = useParams();
  return (
    <div>
      <h1>Project Board {id} ok</h1>
    </div>
  )
}
