"use client";
import Author from "@/components/Project/Author";
import { ProjectDetailsQuery } from "@/graphql/queries/Project";
import { ProjectDetailsQuery as ProjectDetailsQueryType } from "@/graphql/queries/__generated__/ProjectDetailsQuery.graphql";
import { ProjectDetailsFragment } from "@/graphql/fragments/ProjectFragment";
import { ProjectFragment_details$key } from "@/graphql/fragments/__generated__/ProjectFragment_details.graphql";
import React, { useEffect, useState } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import CommentSection from "@/components/Comment/CommentSection";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import VoteButton from "@/components/Project/VoteButton";
import { fetchMarkdownFromIpfs } from "@/utils/ipfsUtils";
import MarkdownViewer from "@/components/Project/document/MarkdownViewer";
import { Edit } from "lucide-react";
import { UserFragment } from "@/graphql/fragments/UserFragment";
import { UserFragment$key } from "@/graphql/fragments/__generated__/UserFragment.graphql";

type Props = {
  params: { id: string };
};

const ProjectDetailsPage = ({ params: { id } }: Props) => {
  const { did } = useAuthSessionContext();
  const [markdown, setMarkdown] = useState("");
  const data = useLazyLoadQuery<ProjectDetailsQueryType>(ProjectDetailsQuery, {
    projectId: id,
    userId: did,
  });
  const project = useFragment<ProjectFragment_details$key>(
    ProjectDetailsFragment,
    data.node
  );
  const author = useFragment(
    UserFragment,
    project?.author! as UserFragment$key
  );

  useEffect(() => {
    // TODO: Get CID by calling smart contract
    const markdownCid =
      "bafkreiafoy44fbdbub5gjmq44pu6htfs2v44mm6xiawggczmdgpvmj6xnq";

    (async () => {
      try {
        const markdownText = await fetchMarkdownFromIpfs(markdownCid);
        if (markdownText) {
          setMarkdown(markdownText);
        }
      } catch (e) {
        console.error(
          "Error getting markdown from IPFS",
          markdownCid,
          "Error: ",
          e
        );
      }
    })();
  }, []);

  const canEdit = did == author.id || project?.coAuthors?.includes(did);

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
        <div className="my-8">
          {canEdit && (
            <a href={`/projects/${id}/document`} className="btn btn-secondary">
              <Edit />
            </a>
          )}
          {markdown && <MarkdownViewer markdown={markdown} />}
        </div>
        <CommentSection commentsData={project} />
      </div>
    )
  );
};

export default ProjectDetailsPage;
