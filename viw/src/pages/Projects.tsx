import { Link } from "react-router-dom";
import { useTenant } from "../context/TenantContext";

export default function Projects() {

  const { activeTenant } = useTenant();

  return (
    <div className="">
      <div className="text-3xl">Projects</div>
      <div className="text-3xl">{activeTenant?.name}</div>
      <Link to="/board" >
        Sprint Board
      </Link>
    </div>
  )
}
