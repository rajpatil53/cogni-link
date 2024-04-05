import { graphql } from "relay-runtime";

export const ProjectListQuery = graphql`
  query ProjectListQuery($userId: ID!) {
    ...ProjectFragment_list
  }
`;

export const ProjectDetailsQuery = graphql`
  query ProjectDetailsQuery($projectId: ID!, $userId: ID!) {
    node(id: $projectId) {
      ... on Project {
        ...ProjectFragment_details
      }
    }
  }
`;
