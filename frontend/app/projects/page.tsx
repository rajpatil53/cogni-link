"use client";
import { ProjectListQuery } from "@/graphql/queries/Project";
import { ProjectListQuery as ProjectListQueryType } from "@/graphql/queries/__generated__/ProjectListQuery.graphql";
import React, { useEffect, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import ProjectList from "@/components/Project/ProjectList";

type Props = {};

const ProjectListPage = (props: Props) => {
  const { did } = useAuthSessionContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const projectListData = useLazyLoadQuery<ProjectListQueryType>(
    ProjectListQuery,
    {
      userId: did,
    }
  );

  return (
    isClient && (
      <div className="container mx-auto py-24">
        <ProjectList data={projectListData} />
      </div>
    )
  );
};

export default ProjectListPage;
