import React, { useTransition } from "react";
import ProjectCard from "./ProjectCard";
import { ProjectListQuery$data } from "@/graphql/queries/__generated__/ProjectListQuery.graphql";
import { usePaginationFragment } from "react-relay";
import { ProjectListFragment } from "@/graphql/fragments/ProjectFragment";

type Props = {
  data: ProjectListQuery$data;
};

const ProjectList = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { data: projectList, loadNext } = usePaginationFragment(
    ProjectListFragment,
    data
  );

  const onLoadMore = () => {
    startTransition(() => {
      loadNext(6);
    });
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(projectList as any).projectIndex?.edges?.map((project: any) => (
          <ProjectCard
            projectFragment={project!.node!}
            key={project?.node?.id}
          ></ProjectCard>
        ))}
      </div>
      {(projectList as any).projectIndex.pageInfo.hasNextPage && (
        <button
          className="btn btn-outline btn-info flex mx-auto mt-8"
          onClick={onLoadMore}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner"></span>
              loading
            </>
          ) : (
            "Load more"
          )}
        </button>
      )}
    </>
  );
};

export default ProjectList;
