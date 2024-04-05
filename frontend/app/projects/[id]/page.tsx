"use client";
import Author from "@/components/Project/Author";
import { ProjectDetailsQuery } from "@/graphql/queries/Project";
import { ProjectDetailsQuery as ProjectDetailsQueryType } from "@/graphql/queries/__generated__/ProjectDetailsQuery.graphql";
import { ProjectDetailsFragment } from "@/graphql/fragments/ProjectFragment";
import { ProjectFragment_details$key } from "@/graphql/fragments/__generated__/ProjectFragment_details.graphql";
import React from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import CommentSection from "@/components/Comment/CommentSection";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import VoteButton from "@/components/Project/VoteButton";

type Props = {
  params: { id: string };
};

const ProjectDetailsPage = ({ params: { id } }: Props) => {
  const { did } = useAuthSessionContext();
  const data = useLazyLoadQuery<ProjectDetailsQueryType>(ProjectDetailsQuery, {
    projectId: id,
    viewerId: did,
  });
  const project = useFragment<ProjectFragment_details$key>(
    ProjectDetailsFragment,
    data.node
  );

  return (
    project && (
      <div className="container mx-auto py-24">
        <div className="prose">
          <h1>{project.title}</h1>
          {project.author && <Author authorData={project.author} />}
          <p>{project.description}</p>
        </div>
        <div className="mt-8 flex gap-2">
          <VoteButton type={"UP_VOTE"} votesFragment={project} />
          <VoteButton type={"DOWN_VOTE"} votesFragment={project} />
        </div>
        <CommentSection commentsData={project} />
      </div>
    )
  );
};

export default ProjectDetailsPage;
