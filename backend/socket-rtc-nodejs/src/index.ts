const mongoose = require('mongoose');

import { Server } from "./server";

const db = require('./db');
const { deleteOldMediaFiles } = require('./util/file-old-delete');

require('dotenv').config();

const server = new Server();
 
// server.listen(port => {
//  console.log(`Server is listening on http://localhost:${port}`);
// });

// export let io: any;

const dbName = process.env.MONGO_DB;
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9nwqj.mongodb.net/${dbName}?retryWrites=true&w=majority`
)
  .then((result: any) => {
    console.log(`Connected to mongoDB, ${dbName}`);

    // const listen = server.listen(port => {
    //   console.log(`Server is listening on http://localhost:${port}, sr-talk`);
    //  });
    deleteOldMediaFiles();

    db.initDb((err: any, db: any) => {
      if (err) {
          console.log(err);
      } else {
        const listen = server.listen(port => {
          console.log(`Server is listening on http://localhost:${port}, sr-talk`);
        });
      }
    });
  
})
  .catch((err: any) => console.log(err));