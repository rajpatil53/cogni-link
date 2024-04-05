import { graphql } from "relay-runtime";

export const SetProfileMutation = graphql`
  mutation ProfileSetMutation($input: SetProfileInput!) {
    setProfile(input: $input) {
      document {
        id
        ...UserFragment_profile
      }
    }
  }
`;

export const UpdateProfileMutation = graphql`
  mutation ProfileUpdateMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      document {
        id
        ...UserFragment_profile
      }
    }
  }
`;
