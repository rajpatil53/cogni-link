import { CommentCreateMutation } from "@/graphql/mutations/Comment";
import { CommentCreateMutation as CommentCreateMutationType } from "@/graphql/mutations/__generated__/CommentCreateMutation.graphql";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ConnectionHandler, useMutation } from "react-relay";

type Props = {
  projectId: string;
};

type CommentFormInputs = {
  body: string;
};

const CommentForm = ({ projectId }: Props) => {
  const { isAuthenticated } = useAuthSessionContext();
  const [commitMutation, isMutationInFlight] =
    useMutation<CommentCreateMutationType>(CommentCreateMutation);

  const { register, handleSubmit } = useForm<CommentFormInputs>();

  const onSubmit: SubmitHandler<CommentFormInputs> = (data) => {
    commitMutation({
      variables: {
        input: {
          content: {
            body: data.body,
            created: new Date().toISOString(),
            subjectId: projectId,
          },
        },
      },
      updater: (store) => {
        const payload = store.getRootField("createComment");
        const comment = payload.getLinkedRecord("document");
        const project = store.get(projectId);
        if (!project) return;

        const connection = ConnectionHandler.getConnection(
          project!,
          "ProjectFragment_comments",
          { sorting: { created: "DESC" } }
        );
        if (!connection) return;

        const edge = ConnectionHandler.createEdge(
          store,
          connection!,
          comment,
          "CommentEdge"
        );
        ConnectionHandler.insertEdgeBefore(connection!, edge);
      },
    });
  };

  return (
    <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control mb-2">
        <label htmlFor="comment" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment"
          rows={3}
          className="textarea textarea-bordered w-full"
          placeholder="Write a comment..."
          required
          {...register("body", { required: true })}
        ></textarea>
      </div>
      <input
        type="submit"
        value="Post comment"
        className="btn"
        disabled={isMutationInFlight || isAuthenticated}
      />
    </form>
  );
};

export default CommentForm;
