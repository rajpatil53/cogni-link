import { graphql } from "relay-runtime";

export const ProjectVotesFragment = graphql`
  fragment ProjectFragment_votes on Project {
    id
    upVotesCount: votesCount(filters: { where: { type: { equalTo: UP_VOTE } } })
    downVotesCount: votesCount(
      filters: { where: { type: { equalTo: DOWN_VOTE } } }
    )
    userVote: votes(first: 1, account: $userId) {
      edges {
        node {
          id
          type
        }
      }
    }
  }
`;

export const ProjectCommentsFragment = graphql`
  fragment ProjectFragment_comments on Project
  @refetchable(queryName: "ProjectCommentsPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int", defaultValue: 5 }
  ) {
    id
    commentsCount
    comments(after: $cursor, first: $count, sorting: { created: DESC })
      @connection(key: "ProjectFragment_comments") {
      edges {
        node {
          id
          owner {
            ...UserFragment
          }
          body
          created
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const ProjectListFragment = graphql`
  fragment ProjectFragment_list on Query
  @refetchable(queryName: "ProjectListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int", defaultValue: 6 }
  ) {
    projectIndex(after: $cursor, first: $count)
      @connection(key: "Query_projectIndex") {
      edges {
        node {
          id
          ...ProjectFragment_card
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const ProjectCardFragment = graphql`
  fragment ProjectFragment_card on Project {
    id
    title
    description
    author {
      ...UserFragment
    }
    ...ProjectFragment_votes
    commentsCount
  }
`;

export const ProjectDetailsFragment = graphql`
  fragment ProjectFragment_details on Project {
    id
    title
    description
    author {
      ...UserFragment
    }
    coAuthors
    ...ProjectFragment_votes
    commentsCount
    ...ProjectFragment_comments
  }
`;
