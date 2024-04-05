import { ProjectCreateMutation } from "@/graphql/mutations/Project";
import { ProjectCreateMutation as ProjectCreateMutationType } from "@/graphql/mutations/__generated__/ProjectCreateMutation.graphql";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-relay";

type Props = {};
type ProjectFormInputs = {
  title: string;
  description: string;
};

const ProjectForm = (props: Props) => {
  const router = useRouter();
  const { did } = useAuthSessionContext();
  const [commitMutation, isMutationInFlight] =
    useMutation<ProjectCreateMutationType>(ProjectCreateMutation);

  const { register, handleSubmit } = useForm<ProjectFormInputs>();

  const onSubmit: SubmitHandler<ProjectFormInputs> = (data) => {
    commitMutation({
      variables: {
        input: {
          content: {
            title: data.title,
            description: data.description,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
        },
        userId: did,
      },
      onCompleted(response, errors) {
        if (response.createProject?.document.id) {
          router.push("/projects/" + response.createProject!.document.id);
        }
      },
    });
  };

  return (
    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Project Title"
          className="input input-bordered"
          required
          {...register("title", { required: true })}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <input
          type="text"
          placeholder="Short description"
          className="input input-bordered"
          required
          {...register("description", { required: true })}
        />
      </div>
      <div className="form-control mt-6">
        <input
          type="submit"
          value="Create Project"
          className="btn btn-primary"
          disabled={isMutationInFlight}
        ></input>
      </div>
    </form>
  );
};

export default ProjectForm;
