"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const server_1 = require("./server");
const db = require('./db');
const { deleteOldMediaFiles } = require('./util/file-old-delete');
require('dotenv').config();
const server = new server_1.Server();
// server.listen(port => {
//  console.log(`Server is listening on http://localhost:${port}`);
// });
// export let io: any;
const dbName = process.env.MONGO_DB;
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9nwqj.mongodb.net/${dbName}?retryWrites=true&w=majority`)
    .then((result) => {
    console.log(`Connected to mongoDB, ${dbName}`);
    // const listen = server.listen(port => {
    //   console.log(`Server is listening on http://localhost:${port}, sr-talk`);
    //  });
    //// deleteOldMediaFiles();
    db.initDb((err, db) => {
        if (err) {
            console.log(err);
        }
        else {
            const listen = server.listen(port => {
                console.log(`Server is listening on http://localhost:${port}, sr-talk`);
            });
        }
    });
})
    .catch((err) => console.log(err));
