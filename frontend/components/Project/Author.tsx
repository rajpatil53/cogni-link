import { UserFragment } from "@/graphql/fragments/UserFragment";
import { UserFragment$key } from "@/graphql/fragments/__generated__/UserFragment.graphql";
import { useFragment } from "react-relay";
import ProfileTile from "../Profile/ProfileTile";

type Props = {
  authorData: UserFragment$key;
};

const Author = ({ authorData }: Props) => {
  const author = useFragment(UserFragment, authorData);

  return <ProfileTile user={author} />;
};

export default Author;
