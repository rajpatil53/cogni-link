import { graphql } from "relay-runtime";

export const UserProfileFragment = graphql`
  fragment UserFragment_profile on Profile {
    id
    name
    bio
    avatar
  }
`;

export const UserFragment = graphql`
  fragment UserFragment on CeramicAccount {
    id
    profile {
      ...UserFragment_profile
    }
  }
`;
