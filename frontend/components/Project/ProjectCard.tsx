import { ProjectCardFragment } from "@/graphql/fragments/ProjectFragment";
import { ProjectFragment_card$key } from "@/graphql/fragments/__generated__/ProjectFragment_card.graphql";
import React from "react";
import { useFragment } from "react-relay";
import Author from "./Author";
import { ExternalLink, MessageCircle } from "lucide-react";
import VoteButton from "./VoteButton";

type Props = {
  projectFragment: ProjectFragment_card$key;
};

const ProjectCard = ({ projectFragment }: Props) => {
  const project = useFragment(ProjectCardFragment, projectFragment);
  return (
    <div className="card bg-base-200 shadow-lg text-base-content">
      <div className="card-body">
        <a
          href={`projects/${project.id}`}
          className="link flex items-center gap-1"
        >
          <h2 className="card-title">{project.title}</h2>
          <ExternalLink size={16} />
        </a>
        <Author authorData={project.author} />
        <p>{project.description}</p>
        <div className="flex flex-wrap gap-2 h-auto">
          <VoteButton type={"UP_VOTE"} votesFragment={project} />
          <VoteButton type={"DOWN_VOTE"} votesFragment={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
