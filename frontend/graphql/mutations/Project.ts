import { graphql } from "relay-runtime";

export const ProjectCreateMutation = graphql`
  mutation ProjectCreateMutation($input: CreateProjectInput!, $viewerId: ID!) {
    createProject(input: $input) {
      document {
        id
        ...ProjectFragment_details
      }
    }
  }
`;

export const ProjectUpdateMutation = graphql`
  mutation ProjectUpdateMutation($input: UpdateProjectInput!, $viewerId: ID!) {
    updateProject(input: $input) {
      document {
        id
        ...ProjectFragment_details
      }
    }
  }
`;
