"use client";
import ProfileForm from "@/components/Profile/ProfileForm";
import { ProfileQuery } from "@/graphql/queries/Profile";
import { ProfileQuery as ProfileQueryType } from "@/graphql/queries/__generated__/ProfileQuery.graphql";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";

import React from "react";
import { useLazyLoadQuery } from "react-relay";

type Props = {};

const ProfilePage = (props: Props) => {
  const { did } = useAuthSessionContext();
  const profileData = useLazyLoadQuery<ProfileQueryType>(ProfileQuery, {
    userId: did,
  });
  return (
    <div className="container mx-auto py-24 flex justify-center">
      <div className="card shrink-0 w-full max-w-xl shadow-xl bg-base-200 rounded-xl">
        <ProfileForm profileData={profileData.node?.profile} />
      </div>
    </div>
  );
};

export default ProfilePage;
