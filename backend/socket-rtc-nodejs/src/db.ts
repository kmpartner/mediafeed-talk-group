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

// var serviceAccount = require("../credentials/credentials.json");
// const mongoDbUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-t2qe0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const dbName = process.env.MONGO_DB_MESSAGES;
const mongoDbUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9nwqj.mongodb.net/${dbName}?retryWrites=true&w=majority`

let _db: any;

const initDb = (callback: any) => {
  if(_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
  .then((client: any) => {
    console.log(`in initDb, connected to db, ${dbName}`);
    _db = client.db();
    callback(null, _db);
  })
  .catch((err: any) => {
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
  getDb
};