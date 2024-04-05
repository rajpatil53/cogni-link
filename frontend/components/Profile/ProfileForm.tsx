import { UserProfileFragment } from "@/graphql/fragments/UserFragment";
import { UserFragment_profile$key } from "@/graphql/fragments/__generated__/UserFragment_profile.graphql";
import { SetProfileMutation } from "@/graphql/mutations/Profile";
import { ProfileSetMutation } from "@/graphql/mutations/__generated__/ProfileSetMutation.graphql";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";

type Props = {
  profileData?: UserFragment_profile$key | null;
};
type ProfileFormInputs = {
  name: string;
  bio: string;
  avatar: string;
};

const ProfileForm = ({ profileData }: Props) => {
  const profileValue = useFragment(UserProfileFragment, profileData);

  const [commitMutation, isMutationInFlight] =
    useMutation<ProfileSetMutation>(SetProfileMutation);

  const { register, handleSubmit } = useForm<ProfileFormInputs>({
    values: {
      name: profileValue?.name || "",
      bio: profileValue?.bio || "",
      avatar: profileValue?.avatar || "",
    },
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    commitMutation({
      variables: {
        input: {
          content: {
            name: data.name,
            bio: data.bio,
            avatar: data.avatar,
          },
        },
      },
    });
  };

  return (
    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className="input input-bordered"
          required
          {...register("name", { required: true })}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <input
          type="text"
          placeholder="Short description"
          className="input input-bordered"
          required
          {...register("bio", { required: true })}
        />
      </div>
      <div className="form-control mt-6">
        <input
          type="submit"
          value="Save Profile"
          className="btn btn-primary"
          disabled={isMutationInFlight}
        ></input>
      </div>
    </form>
  );
};

export default ProfileForm;
