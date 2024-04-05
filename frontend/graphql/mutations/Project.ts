import { graphql } from "relay-runtime";

export const ProjectCreateMutation = graphql`
  mutation ProjectCreateMutation($input: CreateProjectInput!, $userId: ID!) {
    createProject(input: $input) {
      document {
        id
        ...ProjectFragment_details
      }
    }
  }
`;

export const ProjectUpdateMutation = graphql`
  mutation ProjectUpdateMutation($input: UpdateProjectInput!, $userId: ID!) {
    updateProject(input: $input) {
      document {
        id
        ...ProjectFragment_details
      }
    }
  }
`;
