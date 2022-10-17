const { buildSchema } = require('graphql');

module.exports = `

  type AuthData {
    token: String!
    userId: String!
    name: String
    exp: Int!
    iat: Int!
  }

  type ResetTokenData {
    resetToken: String!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getResetPasswordTokenUser(email: String!): User!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    postReset(email: String!): ResetTokenData!
    postNewPassword(email: String!, password: String!, passwordToken: String!): Boolean
  }

  type Result {
      id: String
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;