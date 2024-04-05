import { UserProfileFragment } from "@/graphql/fragments/UserFragment";
import { UserFragment$data } from "@/graphql/fragments/__generated__/UserFragment.graphql";
import { UserFragment_profile$key } from "@/graphql/fragments/__generated__/UserFragment_profile.graphql";
import { getAccountIdByDID } from "did-session";
import React from "react";
import { useFragment } from "react-relay";
import { getAddress } from "viem";
import { User2 } from "lucide-react";

type Props = {
  user: UserFragment$data;
};

const ProfileTile = ({ user }: Props) => {
  const profile = useFragment(
    UserProfileFragment,
    user.profile as UserFragment_profile$key | undefined
  );
  return (
    <div className="not-prose flex items-center gap-2">
      {profile?.avatar ? (
        <div className="avatar">
          <div className="w-6 rounded-full">
            <img
              src={profile.avatar}
              alt={
                profile?.name || getAddress(getAccountIdByDID(user.id).address)
              }
            />
          </div>
        </div>
      ) : (
        <div className="avatar placeholder">
          <div className="bg-accent text-accent-content rounded-full w-6 text-sm">
            <span>
              {profile?.name.charAt(0).toUpperCase() || <User2 size={16} />}
            </span>
          </div>
        </div>
      )}

      <span className="w-28 block overflow-hidden text-ellipsis">
        {profile?.name || getAddress(getAccountIdByDID(user.id).address)}
      </span>
    </div>
  );
};

export default ProfileTile;
