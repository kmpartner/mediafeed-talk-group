// const mongoose = require('mongoose');

// const {
//   MONGO_USERNAME,
//   MONGO_PASSWORD,
//   MONGO_HOSTNAME,
//   MONGO_PORT,
//   MONGO_DB
// } = process.env;

// const options = {
//   useNewUrlParser: true,
//   reconnectTries: Number.MAX_VALUE,
//   reconnectInterval: 500,
//   connectTimeoutMS: 10000,
// };

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// mongoose.connect(url, options).then( function() {
//   console.log('MongoDB is connected');
// })
//   .catch( function(err) {
//   console.log(err);
// });


const mongodb = require('mongodb');

require('dotenv').config();

const MongoClient = mongodb.MongoClient;

const dbName = process.env.MONGO_DB;
const mongoHost = process.env.MONGO_HOSTNAME;
// var serviceAccount = require("../credentials/credentials.json");

// const mongoDbUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-t2qe0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const mongoDbUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${mongoHost}/${dbName}?retryWrites=true&w=majority`

let _db;

const initDb = callback => {
  if(_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
  .then(client => {
    // console.log(client);
    _db = client.db();
    callback(null, _db);
  })
  .catch(err => {
    callback(err);
  })
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
  mongoDbUrl,
};