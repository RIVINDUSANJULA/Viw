// import NotFound from "./notFound";
import KanbanBoard from "../features/components/KanbanBoard";

import { useTenant } from "../context/TenantContext";

export default function ProjectBoard() {
  const { activeTenant } = useTenant();
  
  return (
    <div>
      <div>{activeTenant?.name}</div>
      <button>Add New</button>
      <div>
        <KanbanBoard />
      </div>
      
    </div>
  )
}
