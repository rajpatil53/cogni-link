import { ProjectVotesFragment } from "@/graphql/fragments/ProjectFragment";
import {
  ProjectFragment_votes$data,
  ProjectFragment_votes$key,
  VoteType,
} from "@/graphql/fragments/__generated__/ProjectFragment_votes.graphql";
import {
  VoteCreateMutation,
  VoteUpdateMutation,
} from "@/graphql/mutations/Vote";
import { VoteCreateMutation as VoteCreateMutationType } from "@/graphql/mutations/__generated__/VoteCreateMutation.graphql";
import { VoteUpdateMutation as VoteUpdateMutationType } from "@/graphql/mutations/__generated__/VoteUpdateMutation.graphql";
import { useAuthSessionContext } from "@/providers/AuthSessionProvider";
import clsx from "clsx";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useMemo } from "react";
import { useFragment, useMutation } from "react-relay";

type Props = {
  type: VoteType;
  votesFragment: ProjectFragment_votes$key;
};

const getIcon = (voteType: VoteType) => {
  switch (voteType) {
    case "UP_VOTE":
      return <ThumbsUp size={18} />;
    case "DOWN_VOTE":
      return <ThumbsDown size={18} />;
    default:
      return;
  }
};

const getLabel = (
  voteType: VoteType,
  votesData: ProjectFragment_votes$data
) => {
  switch (voteType) {
    case "UP_VOTE":
      return votesData.upVotesCount;
    case "DOWN_VOTE":
      return votesData.downVotesCount;
    default:
      return;
  }
};

const VoteButton = ({ type, votesFragment }: Props) => {
  const { did, isAuthenticated } = useAuthSessionContext();
  const votesData = useFragment(ProjectVotesFragment, votesFragment);
  const [commitCreateMutation, isCreateMutationInFlight] =
    useMutation<VoteCreateMutationType>(VoteCreateMutation);
  const [commitUpdateMutation, isUpdateMutationInFlight] =
    useMutation<VoteUpdateMutationType>(VoteUpdateMutation);
  const userVote = votesData?.userVote?.edges
    ? votesData?.userVote?.edges![0]?.node
    : null;
  const icon = getIcon(type);
  const label = getLabel(type, votesData);

  function onVoteButtonClicked() {
    try {
      if (userVote) {
        commitUpdateMutation({
          variables: {
            input: {
              id: userVote.id,
              content: {
                type: userVote.type == type ? "NONE" : type,
                updated: new Date().toISOString(),
              },
            },
            userId: did,
          },
        });
      } else {
        commitCreateMutation({
          variables: {
            input: {
              content: {
                subjectId: votesData.id,
                type: type,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
              },
            },
            userId: did,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <button
      className={clsx({
        "btn btn-sqare btn-sm": true,
        "btn-secondary": userVote?.type == type,
      })}
      onClick={onVoteButtonClicked}
      disabled={
        isCreateMutationInFlight || isUpdateMutationInFlight || isAuthenticated
      }
    >
      {icon}
      {label}
    </button>
  );
};

export default VoteButton;
