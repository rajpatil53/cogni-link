import React, { useTransition } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { usePaginationFragment } from "react-relay";
import { ProjectCommentsFragment } from "@/graphql/fragments/ProjectFragment";
import { ProjectFragment_comments$key } from "@/graphql/fragments/__generated__/ProjectFragment_comments.graphql";

type Props = {
  commentsData: ProjectFragment_comments$key;
};

const CommentSection = ({ commentsData }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { data: commentsDetails, loadNext } = usePaginationFragment(
    ProjectCommentsFragment,
    commentsData
  );

  const onLoadMore = () => {
    startTransition(() => {
      loadNext(5);
    });
  };

  return (
    <section className="py-8 antialiased">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-2xl font-bold">
          Comments ({commentsDetails.commentsCount})
        </h2>
      </div>
      <CommentForm projectId={commentsDetails.id} />
      {commentsDetails.comments.edges?.map((commentEdge) => {
        const comment = commentEdge?.node;
        if (comment) {
          return (
            <Comment
              key={comment.id}
              body={comment.body}
              userData={comment.owner}
              createdAt={comment.created}
            />
          );
        }
      })}
      {commentsDetails.comments.pageInfo.hasNextPage && (
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
    </section>
  );
};

export default CommentSection;
