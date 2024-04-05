import { graphql } from "relay-runtime";

export const VoteCreateMutation = graphql`
  mutation VoteCreateMutation($input: CreateVoteInput!, $viewerId: ID!) {
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
  mutation VoteUpdateMutation($input: UpdateVoteInput!, $viewerId: ID!) {
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
