import { graphql } from "relay-runtime";

export const ProjectListQuery = graphql`
  query ProjectListQuery($viewerId: ID!) {
    ...ProjectFragment_list
  }
`;

export const ProjectDetailsQuery = graphql`
  query ProjectDetailsQuery($projectId: ID!, $viewerId: ID!) {
    node(id: $projectId) {
      ... on Project {
        ...ProjectFragment_details
      }
    }
  }
`;
