import { Link } from "react-router-dom";
import {projects}  from "../features/data/Data";
import { useTenant } from "../context/TenantContext";

export default function Projects() {

  const { activeTenant } = useTenant();

  return (
    <div className="">
      <div className="text-3xl">Projects</div>
      <div className="text-3xl">{activeTenant?.name}</div>
      <div>
        {projects.map((x) => (
          <Link
            key={x.id}
            to={`projects/${x.id}`}
            className="bg-white text-black text-3xl"
          >
            {x.name}
          </Link>
        ))}</div>
    </div>
  )
}
