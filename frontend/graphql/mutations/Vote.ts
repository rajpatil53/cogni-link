import { graphql } from "relay-runtime";

export const VoteCreateMutation = graphql`
  mutation VoteCreateMutation($input: CreateVoteInput!, $userId: ID!) {
    createVote(input: $input) {
      document {
        id
        subject {
          id
          ...ProjectFragment_votes
        }
      }
    }
  }
`;

export const VoteUpdateMutation = graphql`
  mutation VoteUpdateMutation($input: UpdateVoteInput!, $userId: ID!) {
    updateVote(input: $input) {
      document {
        id
        subject {
          id
          ...ProjectFragment_votes
        }
      }
    }
  }
`;
