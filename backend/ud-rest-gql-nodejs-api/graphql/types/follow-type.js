const { buildSchema } = require('graphql');

module.exports = `
  type Comment {
    _id: ID!
    content: String!
    creatorId: ID!
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

  type FollowingUser {
    _id: ID
    userId: ID!
    name: String
    imageUrl: String
    createdAt: String
  }

  type FollowingUserList {
    userId: String
    followedByList: [FollowingUser]
  }

  type FollowerTable {
    userId: String!
    user_id: String 
    followingUserId: String!
  }

  type FavoritedUser {
    _id: ID
    userId: ID!
    name: String
    imageUrl: String
    createdAt: String
  }

  type FavoritedUserList {
    postId: String
    favoritedByList: [FavoritedUser]
  }

  type FavoritePost {
    postId: ID!
    userId: ID!
    user_id: ID
  }


  type RootQuery {
    getFollowingUsers: [FollowingUser]!
    getFollowingUser(followingUserId: ID!): FollowingUser!
    getFavoritePosts: [Post]!
    getFavoritePost(postId: ID!): Post!
    comments(postId: ID!): [Comment!]!
    comment(commentId: ID!): Comment!
    getFollowedUserList(userId: ID!): [FollowingUser]
    getFavoritePostUserList(postId: ID!): FavoritedUserList
  }

  type RootMutation {
    addFollowingUser(userId: ID!, followingUserId: ID!): FollowerTable
    deleteFollowingUser(userId: ID!, followingUserId: ID!): Boolean
    addFavoritePost(postId: ID!, userId: ID!): FavoritePost!
    deleteFavoritePost(postId: ID!, userId: ID!): Boolean
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