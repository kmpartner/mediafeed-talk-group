const { buildSchema } = require('graphql');

module.exports = `
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    modifiedImageUrl: String
    thumbnailImageUrl: String
    imagePath: String
    creator: User
    creatorId: ID!
    creator_id: ID
    creatorName: String
    creatorImageUrl: String
    createdAt: String!
    updatedAt: String!
    public: String!
    language: String
    visitNumber: Int
    geolocation: GeolocationData
    totalVisit: Float
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
    public: String!
    locationData: GeolocationInputData
  }

  type VisitData {
    totalVisit: Float
    acceptLanguage: LanguageList
    details: VisitDetails
  }

  type VisitDetails {
    userId: String
    geolocation: GeolocationData
    headers: HeadersData
  }

  type HeadersData {
    origin: String
    acceptLanguage: String
    acceptEncoding: String
    userAgent: String
  }

  type LanguageList {
    name: String
    number: Float
  }

  type RootQuery {
    posts(page: Int, userOnly: String, userId: String): PostData!
    post(id: ID!, userId: ID, locationData: GeolocationInputData): Post!
    user: User!
  }

  type RootMutation {
    createPost(postInput: PostInputData): Post!
    updatePost(id: ID!, postInput: PostInputData): Post!
    deletePost(id: ID!, locationData: GeolocationInputData): Boolean
    deletePostImage(id: ID!): Boolean
  }

  type Result {
      id: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;