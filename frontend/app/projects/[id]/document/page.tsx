"use client";
import { ProjectDetailsQuery } from "@/graphql/queries/Project";
import { ProjectDetailsQuery as ProjectDetailsQueryType } from "@/graphql/queries/__generated__/ProjectDetailsQuery.graphql";
import { ProjectDetailsFragment } from "@/graphql/fragments/ProjectFragment";
import { ProjectFragment_details$key } from "@/graphql/fragments/__generated__/ProjectFragment_details.graphql";
import React, { useEffect, useState } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import MarkdownEditor from "@/components/Project/document/MarkdownEditor";
import { fetchMarkdownFromIpfs } from "@/utils/ipfsUtils";

type Props = {
  params: { id: string };
};

const ProjectDetailsPage = ({ params: { id } }: Props) => {
  const [markdown, setMarkdown] = useState("");
  const { did } = useAuthSessionContext();
  const data = useLazyLoadQuery<ProjectDetailsQueryType>(ProjectDetailsQuery, {
    projectId: id,
    userId: did,
  });
  const project = useFragment<ProjectFragment_details$key>(
    ProjectDetailsFragment,
    data.node
  );

  useEffect(() => {
    const markdownCid =
      "bafkreiafoy44fbdbub5gjmq44pu6htfs2v44mm6xiawggczmdgpvmj6xnq";

    (async () => {
      // Fetch markdown
      // if (markdownCid && typeof markdownCid === "string" && isCid(markdownCid)) {
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

  return (
    project && (
      <div className="container mx-auto py-24">
        <div className="prose">
          <h1>{project.title}</h1>
          {markdown && <MarkdownEditor markdown={markdown} />}
        </div>
      </div>
    )
  );
};

export default ProjectDetailsPage;
