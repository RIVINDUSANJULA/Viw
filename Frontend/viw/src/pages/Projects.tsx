import { Link } from "react-router-dom";
import {projects}  from "../components/Data";
import type { Key } from "react";
// import type { Task } from "../types/types";

// const projectList = data;

export default function Projects() {
  return (
    <div className="">
      <div className="text-3xl">Projects</div>
      <div>
        {projects.map((x: { id: Key; name: string; description: string | undefined;}) => (
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
