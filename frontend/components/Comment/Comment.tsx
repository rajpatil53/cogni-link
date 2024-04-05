import { UserFragment } from "@/graphql/fragments/UserFragment";
import { UserFragment$key } from "@/graphql/fragments/__generated__/UserFragment.graphql";
import React from "react";
import { useFragment } from "react-relay";
import ProfileTile from "../Profile/ProfileTile";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";

type Props = {
  body: string;
  userData: UserFragment$key;
  createdAt: string;
};

const Comment = ({ body, userData, createdAt }: Props) => {
  const { did } = useAuthSessionContext();
  const user = useFragment(UserFragment, userData);
  const isOwner = did == user.id;
  return (
    <article className="p-6 text-base rounded-lg border border-base-300 mb-2">
      <div className="flex justify-between items-center mb-2">
        <ProfileTile user={user} />
        <DateFormatComponent date={createdAt}></DateFormatComponent>
      </div>
      <p>{body}</p>
    </article>
  );
};

export default Comment;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const DateFormatComponent: React.FC<{ date: string }> = ({ date }) => {
  const parsedDate = new Date(date);

  const formattedDate = `${
    monthNames[parsedDate.getMonth()]
  } ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;

  return <span className="text-xs text-gray-500">{formattedDate}</span>;
};
