import { graphql } from "relay-runtime";

export const ProfileQuery = graphql`
  query ProfileQuery($userId: ID!) {
    node(id: $userId) {
      ... on CeramicAccount {
        profile {
          ...UserFragment_profile
        }
      }
    }
  }
`;
