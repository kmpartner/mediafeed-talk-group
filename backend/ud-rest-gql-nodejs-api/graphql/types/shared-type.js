const { buildSchema } = require('graphql');

module.exports = `
  type User {
    _id: ID!
    name: String
    email: String
    password: String
    userId: String
    status: String
    posts: [Post!]!
    imageUrl: String
    imagePath: String
    description: String
    createdAt: String
    updatedAt: String
    lastLoginDate: String
    lastLoginAgent: String
    acceptLanguage: String
    geolocation: GeolocationData
    resetToken: String  
    resetTokenExpiration: Float
    firebaseData: FirebaseData
  }

  type UsersData {
    _id: String!
    userId: String
    name: String
    imageUrl: String
    createdAt: String
  }

  type GeolocationData {
    coords: Coords
    timestamp: Float
  }

  type Coords {
    latitude: Float
    longitude: Float
    altitude: Float
    accuracy: Float
    altitudeAccuracy: Float
    heading: Float
    speed: Float
  }

  input GeolocationInputData {
    coords: CoordsInput
    timestamp: Float
  }

  input CoordsInput {
    latitude: Float
    longitude: Float
    altitude: Float
    accuracy: Float
    altitudeAccuracy: Float
    heading: Float
    speed: Float
  }

  type FirebaseData {
    user: FirebaseUserData
    additionalUserInfo: FierbaseAdditionalUserInfo
  }

  type FirebaseUserData {
    uid: String
    displayName: String
    photoURL: String
    email: String
    emailVerified: Boolean
    lastLoginAt: String
    createdAt: String
  }

  input FirebaseUserDataInput {
    uid: String
    displayName: String
    photoURL: String
    email: String
    emailVerified: Boolean
    lastLoginAt: String
    createdAt: String
  }

  type FierbaseAdditionalUserInfo {
    providerId: String
    isNewUser: Boolean
  }

  input FierbaseAdditionalUserInfoInput {
    providerId: String
    isNewUser: Boolean
  }

  type RootQuery {
    user: User!
    getUsers: [UsersData!]!
    getUserWithImagePath: User!
  }

  type RootMutation {
    updateStatus(status: String, geolocation: GeolocationInputData): User!
    updateUserName(name: String, locationData: GeolocationInputData): User!
    createUserImage(imageUrl: String!, locationData: GeolocationInputData): User!
    deleteUserImage(imageUrl: String!, locationData: GeolocationInputData): Boolean
    updateEmailVerified(fbUserId: String, emailVerified: String): User!
    updateUserInfo(userId: String, email: String, name: String, locationData: GeolocationInputData, 
      firebaseUserDataInput: FirebaseUserDataInput, fierbaseAdditionalUserInfoInput: FierbaseAdditionalUserInfoInput
    ): User!
  }

  type Result {
      id: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;