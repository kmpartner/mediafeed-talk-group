const { buildSchema } = require('graphql');

module.exports = `
  type Comment {
    _id: ID!
    content: String!
    creatorId: ID!
    creator_id: ID
    creatorName: String
    creatorImageUrl: String
    postId: ID!
    parentCommentId: ID
    acceptLanguage: String
    createdAt: String!
    updatedAt: String!
  }

  input CommentInputData {
    content: String!
    postId: ID!
    parentCommentId: ID
    locationData: GeolocationInputData
  }

  type RootQuery {
    comments(postId: ID!): [Comment!]!
    comment(commentId: ID!): Comment!
  }

  type RootMutation {
    createPostComment(commentInput: CommentInputData!): Comment!
    deletePostComment(commentId: ID!): Boolean
  }

  type Result {
      id: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;