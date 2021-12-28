//// merge-graphql-schemas
////  https://www.npmjs.com/package/merge-graphql-schemas#manually-import-each-type

const { mergeResolvers } = require('merge-graphql-schemas');
const authResolvers = require('./auth-resolvers');
const feedResolvers = require('./feed-resolvers');
const commentResolvers = require('./comment-resolvers');
const followResolvers = require('./follow-resolvers');
 
const resolvers = [
  authResolvers,
  feedResolvers,
  commentResolvers,
  followResolvers
];
 
module.exports = mergeResolvers(resolvers);