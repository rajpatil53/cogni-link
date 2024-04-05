import { graphql } from "relay-runtime";

export const CommentCreateMutation = graphql`
  mutation CommentCreateMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      document {
        id
        body
        subjectId
        created
        owner {
          ...UserFragment
        }
      }
    }
  }
`;

export const CommentUpdateMutation = graphql`
  mutation CommentUpdateMutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      document {
        id
        body
        subjectId
        created
        owner {
          ...UserFragment
        }
      }
    }
  }
`;
