const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    modifiedImageUrl: String
    thumbnailImageUrl: String
    creator: User
    creatorId: String!
    creatorName: String
    createdAt: String!
    updatedAt: String!
    public: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    status: String
    posts: [Post]
    imageUrl: String
    createdAt: String
    updatedAt: String
  }

  type AuthData {
    token: String!
    userId: String!
    name: String!
    exp: Int!
    iat: Int!
  }

  type Comment {
    _id: ID!
    content: String!

    creatorId: String
    creatorName: String
    postId: String!
    parentCommentId: String
    createdAt: String!
    updatedAt: String!
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
    public: String!
  }

  input CommentInputData {
    content: String!
    postId: String!
    parentCommentId: String
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts(page: Int, userOnly: String, userId: String): PostData!
    post(id: ID!): Post!
    user: User!
    comments(postId: String!): [Comment!]!
    comment(commentId: ID!): Comment!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
    updatePost(id: ID!, postInput: PostInputData): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String): User!
    createPostComment(commentInput: CommentInputData!): Comment!
    deletePostComment(commentId: ID!): Boolean
    createUserImage(imageUrl: String!): User!
    deleteUserImage(imageUrl: String!): Boolean
  }

  type Result {
      id: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);