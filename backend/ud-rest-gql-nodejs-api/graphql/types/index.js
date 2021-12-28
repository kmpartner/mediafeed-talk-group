const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const authType = require('./auth-type');
const feedType = require('./feed-type');
const commentType = require('./comment-type');
const follwoType = require('./follow-type');
const sharedType = require('./shared-type');

const types = [
  authType,
  feedType,
  commentType,
  follwoType,
  sharedType,
];

const combinedTypes = mergeTypes(types);
// console.log(mergeTypes(types));

module.exports = buildSchema(combinedTypes);