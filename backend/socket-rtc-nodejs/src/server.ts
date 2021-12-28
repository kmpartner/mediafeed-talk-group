const path = require('path');
const express = require('express');
import { Application } from "express";
const socketIO = require('socket.io');
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
const bodyParser = require('body-parser');
const socketRedis = require('socket.io-redis');
const Redis = require('ioredis');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const TextTalk = require('./models/text-talk');
const GroupTalk = require('./models/group-talk');
const TalkConnection = require('./models/talk-connection');

// const TestRoutes = require('./routes/test');
const TextTalkRoutes = require('./routes/text-talk');

const { handlePushNotification } = require('./handle-push');

require('dotenv').config();

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private activeSockets: string[] = [];
  private activeSocketsObj: any[] = [];
  private activeGroups: any[] = [];

  private userObj: any = {};

  private textList: object[] = [];


  private readonly DEFAULT_PORT = 4001;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.app = express();

    this.httpServer = createServer(this.app);

    this.io = socketIO(this.httpServer);

    
    // //// for local dev
    const originAllow = 'http://localhost:* http://localhost:8503 http://localhost:8504';
    //// this.io.adapter(socketRedis({ host: '127.0.0.1', port: 6379 }));
    
    // //// for deploy
    // const originAllow = 'https://ud-gqlapi-front.web.app:* https://ud-restapi-front.web.app:* https://ud-gqlapi-front.firebaseapp.com:* https://ud-restapi-front.firebaseapp.com:* https://watakura.xyz:* https://www.watakura.xyz:*'
    // this.io.adapter(socketRedis({ host: 'redis-sr', port: 6379 }));


    this.io.origins(originAllow);



    this.app.use(bodyParser.json()); //application/json

    this.configureApp();
    this.configureRoutes();
    this.handleSocketConnection();
  }

  private configureApp(): void {
    // this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private configureRoutes(): void {

    this.app.use((req: any, res: any, next: any) => {

      //// for push

      var allowedOrigins = [
        'https://ud-gqlapi-front.web.app',
        'https://ud-gqlapi-front.firebaseapp.com',
        'https://ud-restapi-front.web.app',
        'https://ud-restapi-front.firebaseapp.com',
        'https://www.watakura.xyz',
        'https://watakura.xyz',
        // 'http://localhost'
      ];
      var origin = req.headers.origin;
      console.log(origin);
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();



      //// for local dev

      // res.setHeader('Access-Control-Allow-Origin', '*');
      // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization' );
      // if (req.method === 'OPTIONS') {
      //     return res.sendStatus(200);
      // }
      // next();

    })

    // this.app.use('/test', TestRoutes);
    this.app.use('/text-talk', TextTalkRoutes);

    // this.app.get("/", (req, res) => {
    //   res.sendFile("index.html");
    // });

    this.app.get("/", (req, res) => {
      res.send("hello world express socket /");
    });

    this.app.get("/xxx", (req, res) => {
      // res.sendFile("index.html");
      res.send("hello world express socket.io");
    });

    this.app.get("/healthz", (req, res) => {
      // res.sendFile("index.html");
      res.send("hello world express socket.io healthz");
    });



    this.app.use((error: any, req: any, res: any, next: any) => {
      console.log(error);
      const status = error.statusCode || 500;
      const message = error.message;
      const data = error.data;
      res.status(status).json({ message: message, data: data })
    })
  }

  private handleSocketConnection(): void {
    //// initially check auth 

    let jwtUserId: string;

    this.io.use(function(socket: any, next: any) {
      // console.log(socket.handshake);
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, function(err: any, decoded: any) {
          if (err) {
            console.log(err);
            return next(new Error('Authentication error'));
          }

          socket.decoded = decoded;
          jwtUserId = socket.decoded.userId;
          next();
        });
      }
      else {
        next(new Error('Authentication error'));
      }    
    })

    this.io.on("connection", (socket) => {
      console.log('client connected!!, socket.id:', socket.id);

      socket.emit('user-socket', {
        // socket: socket,
        userSocketId: socket.id
      });

      // this.io.emit('new-connection', {
      //   socketId: socket.id,
      //   // activeSockets: this.activeSockets
      // });

      this.io.clients((err: any, clients: any) => {
        console.log('clients in connection', clients); // an array containing socket //// (ids in 'room3')
        this.activeSockets = clients;

        this.io.emit("update-user-list", {
          users: this.activeSockets
        });

      });


      socket.on("call-user", (data: any) => {
        console.log('call-user data', data);

        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id,
          user: data.user
        });




        const destUser = this.activeSocketsObj.find(element => {
          return element.socketId === data.to;
        });

        const userIndex = this.activeSocketsObj.findIndex(element => {
          return element.socketId === socket.id;
        });

        this.activeSocketsObj[userIndex] = {
          socketId: data.user.socketId,
          userId: data.user.userId,
          userName: data.user.userName,
          connectAt: data.user.connectAt,
          calling: true,
          destUser: destUser
        }

        this.io.emit('update-usersObj-list', {
          usersObj: this.activeSocketsObj,
          callingInfo: {
            destUser: destUser,
            user: data.user
          }
        });



      });

      socket.on("make-answer", (data) => {
        console.log('make-answer data', data);

        const destUser = this.activeSocketsObj.find(element => {
          return element.socketId === socket.id
        });

        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer,
          destUser: destUser,
        });
      });

      socket.on('connection-made', async (data) => {
        console.log('connection-made data', data);

        const user = this.activeSocketsObj.find(element => {
          return element.socketId === socket.id;
        });
        // console.log('user', user);

        let talkStartAt;
        const destUser = this.activeSocketsObj.find(element => {
          return element.socketId === user.destUser.socketId;
        })
        if (destUser && destUser.destUser && destUser.destUser.socketId === user.socketId) {
          talkStartAt = Date.now();
        }


        let socketConnection;

        socketConnection = await TextTalk.findOne({
          userId: user.userId,
        });

        if (!socketConnection) {
          // socketConnection = await new TextTalk({ userId: user.userId });
          socketConnection = await new TextTalk({
            userId: user.userId,
            talk: {
              pairId: `${user.userId}-${data.destUser.userId}`,
              text: []
            },
            connection: [],
          });

          await socketConnection.save();
        }

        const talkWithDest = await TextTalk.findOne({
          userId: user.userId,
          'talk.pairId': `${user.userId}-${data.destUser.userId}`
        });

        if (!talkWithDest) {
          socketConnection.talk.push({
            pairId: `${user.userId}-${data.destUser.userId}`,
            text: []
          });

          await socketConnection.save()
        }


        let destConnection;

        destConnection = await TextTalk.findOne({
          userId: data.destUser.userId,
        });

        if (!destConnection) {        
          destConnection = await new TextTalk({
            userId: data.destUser.userId,
            talk: {
              pairId: `${data.destUser.userId}-${user.userId}`,
              text: []
            },
            connection: [],
          });

          await destConnection.save();
        }

        const talkWithUser = await TextTalk.findOne({
          userId: data.destUser.userId,
          'talk.pairId': `${data.destUser.userId}-${user.userId}`
        });

        if (!talkWithUser) {
          destConnection.talk.push({
            pairId: `${data.destUser.userId}-${user.userId}`,
            text: []
          });
          
          await destConnection.save()
        }

        const findConnection = await socketConnection.connection.find((element: any) => {
          // console.log(element);
          return element.socketId === socket.id;
        });
        console.log('findConnection', findConnection);

        findConnection.callTo.push({
          socketId: data.destUser.socketId,
          userId: data.destUser.userId,
          userName: data.destUser.userName,
          connectAt: data.destUser.connectAt,
          talkStartAt: talkStartAt && talkStartAt, //// save in one user to identify which recieved call
          createAt: Date.now(),
          // disconnectAt:
        });
        await socketConnection.save();


        //// get taxt-talk data
        let textTalkOne;

        textTalkOne = await TextTalk.findOne({
          userId: user.userId,
          'talk.pairId': `${user.userId}-${data.destUser.userId}`
        });

        // console.log('textTalkOne', textTalkOne);

        if (!textTalkOne) {
          // textTalkOne = await new TextTalk({
          //   userId: user.userId,
          //   talk: {
          //     pairId: `${user.userId}-${data.destUser.userId}`,
          //     text: []
          //   }
          // })
        }

        const userDestTalk = talkWithDest.talk.find((talk: any) => {
          return talk.pairId === `${user.userId}-${data.destUser.userId}`
        });

        // console.log('talkWithDest.talk', talkWithDest.talk);
        // console.log('userDestTalk', userDestTalk);

        // console.log('textTalkOne.talk[0].text', textTalkOne.talk[0].text)
        socket.emit('update-text-list', {
          // textList: textTalkOne.talk[0].text,
          textList: userDestTalk.text,
        })

        // console.log('talkWithDest.talk', talkWithDest.talk);

        const room1 = `${user.userId}-room`
        const room2 = `${data.destUser.userId}-room`
        socket.join(room1);
        socket.join(room2);

        // this.io.to(room1).to(room2).emit('update-text-list', {
        //   // textList: textTalkOne.talk[0].text,
        //   textList: talkWithDest.talk[0].text,
        //   test: `to ${room1}`,
        //   test2: `to ${room2}`
        // });




        const userIndex = this.activeSocketsObj.findIndex(element => {
          return element.socketId === socket.id;
        });

        this.activeSocketsObj[userIndex] = {
          socketId: user.socketId,
          userId: user.userId,
          userName: user.userName,
          connectAt: user.connectAt,
          calling: true,
          talkStartAt: talkStartAt && talkStartAt,
          destUser: data.destUser
        }

        this.io.emit('update-usersObj-list', {
          usersObj: this.activeSocketsObj,
          callingInfo: {
            destUser: data.destUser,
            user: user
          }
        });

        // const destUserIndex = this.activeSocketsObj.findIndex(element => {
        //   return element.socketId === destUser.socketId;
        // });

        // this.activeSocketsObj[destUserIndex] = {
        //   socketId: destUser.socketId,
        //   userId: destUser.userId,
        //   userName: destUser.userName,
        //   connectAt: destUser.connectAt,
        //   calling: true,
        //   talkStartAt: talkStartAt && talkStartAt,
        //   destUser: user
        // }

      });

      socket.on("reject-call", data => {
        console.log('reject-call data', data);
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id,
          user: data.user
        });
      });

      socket.on("disconnect", async () => {
        console.log('disconnect socket.id', socket.id);

        const user = this.activeSocketsObj.find(element => {
          return element.socketId === socket.id;
        });
        console.log('user in disconnect', user);


        this.io.clients(async (err: any, clients: any) => {
          console.log('clients in disconnect', clients); // an array containing socket ids
          this.activeSockets = clients;

          this.io.emit("update-user-list", {
            users: this.activeSockets
          });

          const nowTime = Date.now();


          // const user = this.activeSocketsObj.find(element => {
          //   return element.socketId === socket.id;
          // });
          // console.log('user in disconnect', user);

          let disconnectInfo = {};

          if (user) {
            disconnectInfo = {
              user: user,
              disconnectAt: nowTime
            };

            this.activeSocketsObj = this.activeSocketsObj.filter(element => {
              // return element.socketId !== socket.id;
              return element.userId !== user.userId;
            });
          }
          // let disconnectInfo = this.activeSocketsObj.find(element => {
          //   return element.socketId === socket.id
          // });

          console.log('this.activeSocketsObj after disconnect', this.activeSocketsObj);

          this.io.emit('update-usersObj-list', {
            usersObj: this.activeSocketsObj,
            disconnectInfo: disconnectInfo
          });

          if (user) {
            // // const socketConnection = await TextTalk.findOne({
            // const socketConnection = await GroupUser.findOne({
            //   userId: user.userId,
            // });

            // const findConnection = await socketConnection.connection.find((element: any) => {
            //   // console.log(element);
            //   return element.socketId === socket.id;
            // });
            // console.log('findConnection', findConnection);

            // findConnection.disconnectAt = nowTime;
            // await socketConnection.save();


            // const talkConnection = await TalkConnection.findOne({
            //   userId: user.userId,
            //   socketId: socket.id,
            // });
            // console.log('talkConection', talkConnection);

            // if (talkConnection) {
            //   talkConnection.disconnectAt = nowTime;
            //   await talkConnection.save();
            // }
          }
        });



        // if (this.activeGroups.length > 0) {
        //   let trimGroups = [];
        //   for (const group of this.activeGroups) {
        //     if (group && group.groupRoomId) {
        //       trimGroups.push(group);
        //     }
        //   }
        //   this.activeGroups = trimGroups;
        // }


        // if (this.activeGroups.length > 0) {
        //   //// delete user if user is in other groups, delete user in other gourp
        //   let gRoomId: any;
        //   let withoutUserGroupObj;
        //   let withoutUserActiveGroupsElement;
        //   let withoutUserMemberList = [];

        //   for (const group of this.activeGroups) {
        //       // console.log('group', group);
           
        //       if (group && group.members && group.members.length > 0) {

        //         const isUserInMember = group.members.find((element: { userId: any; }) => {
        //           return element.userId === user.userId;
        //         });
        //         // console.log('isUserInMember', isUserInMember);
      
        //         withoutUserMemberList = group.members.filter((element: { userId: any; }) => {
        //           return element.userId !== user.userId
        //         });
        //         // console.log('withoutUserMemberList', withoutUserMemberList);
      
        //         if (isUserInMember) {
        //           gRoomId = group.groupRoomId;
      
        //           // withoutUserGroupObj = {
        //           //   groupRoomId: group.groupRoomId,
        //           //   createUserId: group.creatorUserId,
        //           //   groupName: group.groupName,
        //           //   members: withoutUserMemberList  
        //           // };


        //           const groupTalk = await GroupTalk.findOne({
        //             _id: group.groupRoomId
        //           });
      
        //           withoutUserGroupObj = {
        //             // _id: group._id,
        //             // groupRoomId: group.groupRoomId,
        //             // creatorUserId: group.creatorUserId,
        //             // groupName: group.groupName,
        //             // createdAt: group.createdAt,
        //             // members: group.members.concat(userWithRooms),
        //             // talks: group.talks,
      
        //             _id: groupTalk._id,
        //             creatorUserId: groupTalk.creatorUserId,
        //             groupName: groupTalk.groupName,
        //             description: groupTalk.description,
        //             createdAt: groupTalk.createdAt,
        //             talks: groupTalk.talks,
        //             allMemberUserIds: groupTalk.allMemberUserIds,
                    
        //             groupRoomId: group.groupRoomId,
        //             // members: withoutUserMemberList,
        //           };


        //           withoutUserActiveGroupsElement = {
        //             _id: group._id,
        //             groupRoomId: group.groupRoomId,
        //             creatorUserId: group.creatorUserId,
        //             groupName: group.groupName,
        //             description: group.description,
        //             createdAt: group.createdAt,
        //             members: withoutUserMemberList 
        //           };
  
        //           // console.log('gRoomId', gRoomId);
        //           // console.log('withoutUserGroupObj', withoutUserGroupObj);
        //         }

        //       }

            
        //   }
  
        //   this.activeGroups = this.activeGroups.filter(element => {
        //       return element.groupRoomId !== gRoomId;
        //   });
  
        //   // if (withoutUserMemberList.length > 0) {
        //   //   this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
        //   // }
        //   if (withoutUserActiveGroupsElement) {
        //     // this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
        //     this.activeGroups = this.activeGroups.concat(withoutUserActiveGroupsElement);
        //   }

        //   console.log('this.activeGroups in disconnect', this.activeGroups);

        //   this.io.emit('update-group-list', {
        //     // socket.emit('update-group-list', {
        //       groups: this.activeGroups,
        //   });

        //   if (gRoomId && withoutUserGroupObj) {
        //     socket.to(gRoomId).emit('update-group', {
        //       group: withoutUserGroupObj,
        //     });
        //   }
        // }





      });

      // socket.on("user-removed", (data) => {
      //   console.log('user-removed', data);
      // })

      socket.on('hey', () => {
        console.log('hey received');
      });

      socket.on('user-info', async (data) => {
        console.log('user-info data', data);
 
        // this.userObj = data;

        let socketConnection;

        socketConnection = await TextTalk.findOne({
          userId: data.userId,
        });

        if (!socketConnection) {
          socketConnection = await new TextTalk({
            userId: data.userId,
          });
          await socketConnection.save();

          // socketConnection.connection.push({
          //   socketId: socket.id,
          //   connectAt: data.connectAt
          // });
          // await socketConnection.save();


          //// store connection info
          const talkConnection =  await new TalkConnection({
            userId: data.userId,
            socketId: socket.id,
            connectAt: data.connectAt,
            // disconnectAt: 0,
          });
          await talkConnection.save();

        } else {
          const findSocket = await TextTalk.findOne({
            userId: data.userId,
            'connection.socketId': socket.id
          });
          console.log('findSocket', findSocket);

          if (!findSocket) {
            // socketConnection.connection.push({
            //   socketId: socket.id,
            //   connectAt: data.connectAt
            // });
            // await socketConnection.save();


            //// store connection info
            const talkConnection =  await new TalkConnection({
              userId: data.userId,
              socketId: socket.id,
              connectAt: data.connectAt,
              disconnectAt: 0
            });
            await talkConnection.save();
          }
        }



        const withoutUserList = this.activeSocketsObj.filter(element => {
          return element.userId !== data.userId;
        });

        const isSocket = this.activeSockets.find(element => {
          return element === data.socketId;
        });

        // console.log('socket.id', socket.id);
        // console.log('this.activeSockets', this.activeSockets);
        // console.log('this.activeSocketsObj', this.activeSocketsObj);

        const findNewUser = this.activeSocketsObj.find(element => {
          return element.userId === data.userId;
        });

        // console.log('findNewUser', findNewUser);

        
        if (!findNewUser && isSocket) {

          this.activeSocketsObj = withoutUserList.concat(data);
          // this.activeSocketsObj.push(data);

          // this.io.emit('new-user-info', {
          //   newUser: data,
          //   // usersObj: this.activeSocketsObj,
          // });

          socket.broadcast.emit('new-user-info', {
            newUser: data,
            // usersObj: this.activeSocketsObj,
          });

          socket.broadcast.emit('ask-usersObj', {
            askUser: data,
            // usersObj: this.activeSocketsObj,
          });

        }

        if (findNewUser && isSocket) {
          // const withoutOldUser = this.activeSocketsObj.filter(element => {
          //   return element.userId !== data.userId;
          // });

          this.activeSocketsObj = withoutUserList.concat(data);

          // this.io.emit('new-user-info', {
          //   newUser: data,
          //   // usersObj: this.activeSocketsObj,
          // });

          socket.broadcast.emit('new-user-info', {
            newUser: data,
            // usersObj: this.activeSocketsObj,
          });

          socket.broadcast.emit('ask-usersObj', {
            askUser: data,
            // usersObj: this.activeSocketsObj,
          });

        }

      });

      socket.on('update-user-list-recieved', data => {
        console.log('update-user-list-recieved data', data);
        const recievedData = data;

        this.io.clients((err: any, clients: any) => {
          console.log('clients in update-user-list-recieved', clients); // an array containing socket ids

          this.activeSockets = clients;


          // if (clients.length > data.users.length) {
          //   this.activeSockets = data.users;
          // } else {
          //   this.activeSockets = clients;
          // }
          
          console.log('this.activeSockets', this.activeSockets);
        });

      });

      socket.on('new-user-info-recieved', data => {
        console.log('new-user-info-recieved data', data);

        this.io.clients((err: any, clients: any) => {
          console.log('clients in new-user-info-recieved', clients); // an array containing socket ids
          this.activeSockets = clients;
          // console.log('this.activeSockets', this.activeSockets);

          const isNewUserSocket = this.activeSockets.find(element => {
            return element === data.newUser.socketId;
          });

          const isSocket = this.activeSockets.find(element => {
            return element === socket.id;
          });

         
          const withoutOldUser = this.activeSocketsObj.filter(element => {
            return element.userId !== data.userId;
          });

          const isUserExistInList = this.activeSocketsObj.find(element => {
            return element.userId === data.newUser.userId 
            // && element.socketId === data.newUser.socketId;
          });

          if (!isUserExistInList && isNewUserSocket && isSocket) {

            // this.activeSocketsObj.push(data.newUser);

            this.activeSocketsObj = withoutOldUser.concat(data.newUser);

            // if (this.activeSocketsObj.length >= this.activeSockets.length) {
              if (this.activeSocketsObj.length > 1) {

                // this.io.emit('update-usersObj-list', {
                //   usersObj: this.activeSocketsObj,
                //   // connectInfo: data
                // });

                socket.broadcast.emit('update-usersObj-list', {
                  usersObj: this.activeSocketsObj,
                  // connectInfo: data
                });
              }
          }

        });
      })

      socket.on('ask-usersObj-recieved', data => {
        console.log('ask-usersObj-recieved data', data);

        this.io.clients((err: any, clients: any) => {
          console.log('clients in ask-usersObj-recieved-recieved', clients); // an array containing socket ids
          this.activeSockets = clients;

          if (this.activeSocketsObj.length > 1) {
            this.io.emit('update-usersObj-list', {
              usersObj: this.activeSocketsObj,
              // connectInfo: data
            });
          }

        });

      });

      socket.on('update-usersObj-list-recieved', data => {
        console.log('update-usersObj-list-recieved data', data);
        // const updateData = data;

        this.activeSocketsObj = data.usersObj;
        // console.log('this.activeSocketsObj', this.activeSocketsObj);

      });

      // socket.on('get-textList', async (data) => {
      //   console.log('get-textList data', data);

      // });


      socket.on('text-send', async (data) => {
        console.log('text-send, data', data);

        // console.log('jwtUserId', jwtUserId);
        if (data.fromUserId !== jwtUserId) {
          throw new Error('not authenticated');
        }

        let socketConnection;

        socketConnection = await TextTalk.findOne({
          userId: data.fromUserId,
        });

        if (!socketConnection) {
          socketConnection = await new TextTalk({
            userId: data.fromUserId,
            talk: {
              pairId: `${data.fromUserId}-${data.toUserId}`,
              text: []
            },
            connection: [],
          });

          await socketConnection.save();
        };

        const talkWithDest = await TextTalk.findOne({
          userId: data.fromUserId,
          'talk.pairId': `${data.fromUserId}-${data.toUserId}`
        });

        if (!talkWithDest) {
          socketConnection.talk.push({
            pairId: `${data.fromUserId}-${data.toUserId}`,
            text: []
          });

          await socketConnection.save();
        }



        let destConnection;

        destConnection = await TextTalk.findOne({
          userId: data.toUserId,
        });

        if (!destConnection) {        
          destConnection = await new TextTalk({
            userId: data.toUserId,
            talk: {
              pairId: `${data.toUserId}-${data.fromUserId}`,
              text: []
            },
            connection: [],
          });

          await destConnection.save();
        }

        const talkWithUser = await TextTalk.findOne({
          userId: data.toUserId,
          'talk.pairId': `${data.toUserId}-${data.fromUserId}`
        });

        if (!talkWithUser) {
          destConnection.talk.push({
            pairId: `${data.toUserId}-${data.fromUserId}`,
            text: []
          });
          
          await destConnection.save();
        }



        const userDestTalk = talkWithDest.talk.find((talk: any) => {
          return talk.pairId === `${data.fromUserId}-${data.toUserId}`
        });

        const destUserTalk = talkWithUser.talk.find((talk: any) => {
          return talk.pairId === `${data.toUserId}-${data.fromUserId}`
        });

        userDestTalk.text.push(data);
        destUserTalk.text.push(data);

        await talkWithDest.save();
        await talkWithUser.save();


        ////connect case
        if (data.to) {
          const room1 = `${data.toUserId}-room`
          const room2 = `${data.fromUserId}-room`
          // socket.join(room1);
          // socket.join(room2);
  
          this.io.to(room1).to(room2).emit('update-text-list', {
            textList: userDestTalk.text,
            test: `to ${room1}`,
            test2: `to ${room2}`
          });
        }

        //// no connect case
        else {

          //// update textdata of fromUser
          socket.emit('update-text-list', {
            textList: userDestTalk.text,
          });


          //// send textdata to toUser if toUser is online but not connect
          //// if toUser is not online start to send push notification
          const destUser = this.activeSocketsObj.find(element => {
            return element.userId === data.toUserId;
          });
          
          if (destUser) {      
            const room1 = `${data.fromUserId}-${destUser.userId}-noconnect-room`;
            const room2 = `${destUser.userId}-${data.fromUserId}-noconnect-room`;
            socket
              .to(room1)
              .to(room2)
              .emit('update-text-list', {
                textList: userDestTalk.text,
              });


            //// send textdata info to toUser
            this.io.to(destUser.socketId).emit('text-from-noconnect-user', {
              text: userDestTalk.text[userDestTalk.text.length -1],
              // textList: userDestTalk.text
            });


            //// toUser in noconnect-talk and not noconnect-talk with user, start push notify user textdata
            if (destUser.socketRooms) {
              if (!destUser.socketRooms[room1] || !destUser.socketRooms[room2]) {
                // console.log('destUser.socketRooms && !destUser.socketRooms[room1] || !destUser.socketRooms[room2]');

                socket.emit('send-text-forPush', {
                  text: userDestTalk.text[userDestTalk.text.length -1]
                });
              }
            }

            //// toUser online but not in rooms, start push notify textdata
            if (!destUser.socketRooms) {
              socket.emit('send-text-forPush', {
                text: userDestTalk.text[userDestTalk.text.length -1]
              });
            }


          } else {

            socket.emit('send-text-forPush', {
              text: userDestTalk.text[userDestTalk.text.length -1]
            });
          }
        }

      });




      socket.on('text-delete', async (data) => {
        console.log('text-delete, data', data);

        if (data.userId !== data.text.fromUserId) {
          throw new Error('not authenticated');
        }

        let socketConnection;

        socketConnection = await TextTalk.findOne({
          userId: data.text.fromUserId,
        });

        if (!socketConnection) {
          const error = new Error('user talk data not found');
          // error.name = 'authError';
          throw error;
        };

        const talkWithDest = await TextTalk.findOne({
          userId: data.text.fromUserId,
          'talk.pairId': `${data.text.fromUserId}-${data.text.toUserId}`
        });

        if (!talkWithDest) {
          const error = new Error('user talk data not found');
          // error.name = 'authError';
          throw error;
        }



        let destConnection;

        destConnection = await TextTalk.findOne({
          userId: data.text.toUserId,
        });

        if (!destConnection) {        
          const error = new Error('dest user talk data not found');
          // error.name = 'authError';
          throw error;
        }

        const talkWithUser = await TextTalk.findOne({
          userId: data.text.toUserId,
          'talk.pairId': `${data.text.toUserId}-${data.text.fromUserId}`
        });

        if (!talkWithUser) {
          const error = new Error('dest user talk data not found');
          // error.name = 'authError';
          throw error;
        }



        const userDestTalk = talkWithDest.talk.find((talk: any) => {
          return talk.pairId === `${data.text.fromUserId}-${data.text.toUserId}`
        });

        const destUserTalk = talkWithUser.talk.find((talk: any) => {
          return talk.pairId === `${data.text.toUserId}-${data.text.fromUserId}`
        });



        const userDestTalkElement = userDestTalk.text.find((talk: any) => {
          return talk.sendAt === data.text.sendAt;
        });

        const destUserTalkElement = destUserTalk.text.find((talk: any) => {
          return talk.sendAt === data.text.sendAt;
        });
        
        // console.log('destUserTalkElement', destUserTalkElement);


        if (userDestTalkElement) {
          userDestTalk.text.pull({ _id: data.text._id });
        }
        
        if (destUserTalkElement) {
          destUserTalk.text.pull({ _id: destUserTalkElement._id });
        }

        await talkWithDest.save();
        await talkWithUser.save();


        ////connect case
        if (data.text.to) {
          const room1 = `${data.text.toUserId}-room`
          const room2 = `${data.text.fromUserId}-room`
          // socket.join(room1);
          // socket.join(room2);
  
          this.io.to(room1).to(room2).emit('update-text-list', {
            textList: userDestTalk.text,
            test: `to ${room1}`,
            test2: `to ${room2}`
          });
        }

        //// no connect case
        else {

          //// update textdata of fromUser
          socket.emit('update-text-list', {
            textList: userDestTalk.text,
          });





          //// send textdata to toUser if toUser is online but not connect
          //// if toUser is not online start to send push notification
          const destUser = this.activeSocketsObj.find(element => {
            return element.userId === data.text.toUserId;
          });
          
          if (destUser) {      
            const room1 = `${data.text.fromUserId}-${destUser.userId}-noconnect-room`;
            const room2 = `${destUser.userId}-${data.text.fromUserId}-noconnect-room`;
            socket
              .to(room1)
              .to(room2)
              .emit('update-text-list', {
                textList: userDestTalk.text,
              });



          } else {

            // socket.emit('send-text-forPush', {
            //   text: userDestTalk.text[userDestTalk.text.length -1]
            // });

          }




        }

      });











      socket.on('get-textTalks', async (data) => {
        console.log('get-textTalks data', data);

        const textTalks = await TextTalk.find({ userId: data.user.userId });
        // console.log('textTalks', textTalks);

        if (textTalks) {
          const textList = textTalks[0].talk;
          socket.emit('textTalks-data', {
            talkList: textList
          });
        } else {
          socket.emit('textTalks-data', {
            talkList: []
          });
        }

      });

      socket.on('noconnect-get-userDestTalk', async (data) => {
        console.log('noconnect-get-userDestTalk data', data);
        const user = data.user;

        if (jwtUserId !== user.userId) {
          throw new Error('not authenticated');
        }

        let socketConnection;

        socketConnection = await TextTalk.findOne({
          userId: user.userId,
        });

        if (!socketConnection) {
          // socketConnection = await new TextTalk({ userId: user.userId });
          socketConnection = await new TextTalk({
            userId: user.userId,
            talk: {
              pairId: `${user.userId}-${data.destUser.userId}`,
              text: []
            },
            connection: [],
          });

          await socketConnection.save();
        }

        const talkWithDest = await TextTalk.findOne({
          userId: user.userId,
          'talk.pairId': `${user.userId}-${data.destUser.userId}`
        });

        if (!talkWithDest) {
          socketConnection.talk.push({
            pairId: `${user.userId}-${data.destUser.userId}`,
            text: []
          });

          await socketConnection.save()
        }


        let destConnection;

        destConnection = await TextTalk.findOne({
          userId: data.destUser.userId,
        });

        if (!destConnection) {        
          destConnection = await new TextTalk({
            userId: data.destUser.userId,
            talk: {
              pairId: `${data.destUser.userId}-${user.userId}`,
              text: []
            },
            connection: [],
          });

          await destConnection.save();
        }

        const talkWithUser = await TextTalk.findOne({
          userId: data.destUser.userId,
          'talk.pairId': `${data.destUser.userId}-${user.userId}`
        });

        if (!talkWithUser) {
          destConnection.talk.push({
            pairId: `${data.destUser.userId}-${user.userId}`,
            text: []
          });
          
          await destConnection.save()
        }


        const userDestTalk = talkWithDest.talk.find((talk: any) => {
          return talk.pairId === `${user.userId}-${data.destUser.userId}`
        });


        //// leave from existing rooms except for own room, and join noconnect rooms
        for(const room in socket.rooms) {
          if(socket.id !== room) {
            socket.leave(room, () => {
              // console.log('after leave socket.rooms', socket.rooms);        
            })
          };
        }

        // console.log('this.activeSocketObj', this.activeSocketsObj);
        const room1 = `${user.userId}-${data.destUser.userId}-noconnect-room`
        const room2 = `${data.destUser.userId}-${user.userId}-noconnect-room`
        // socket.join(room1);
        // socket.join(room2, () => {
        //   // console.log('socket.rooms room2', socket.rooms);
        //   // console.log('socket.id', socket.id);
        // });

        socket.join(room1).join(room2, () => {
          // console.log('socket.rooms after two join', socket.rooms);

          const userObject = this.activeSocketsObj.find(element => {
            return element.userId === user.userId;
          });
          // console.log('userObject', userObject);
          const userWithRooms = {
            socketId: userObject.socketId,
            userId: userObject.userId,
            userName: userObject.userName,
            userImageUrl: userObject.userImageUrl,
            connectAt: userObject.connectAt,
            socketRooms: socket.rooms
          }
  
          const listWithoutUser = this.activeSocketsObj.filter(element => {
            return element.userId !== user.userId;
          });
  
          this.activeSocketsObj = listWithoutUser.concat(userWithRooms);
          // console.log('this.activeSocketsObj after room', this.activeSocketsObj)

        });

        socket.emit('update-text-list', {
          // textList: textTalkOne.talk[0].text,
          textList: userDestTalk.text,
        });


      });


      //// handle push notification for text send
      handlePushNotification(socket);

      socket.on('get-favorite-users', async (data: any) => {
        console.log('get-favorite-users data', data);
        
        try {
          if (data.userId !== jwtUserId) {
            const error = new Error('not authenticated');
            error.name = 'authError';
            throw error;
          }

          const textTalk = await TextTalk.findOne({
            userId: data.userId,
          });

          if (!textTalk) {
            const error = new Error('Error, textTalk not found');
            // error.name = 'authError';
            throw error;
          }

          const favoriteTalkUsers = textTalk.favoriteTalkUsers ? textTalk.favoriteTalkUsers : [];

          socket.emit('get-favorite-users-result', {
            // action: 'delete-group-member',
            message: 'Getting favorite users success',
            favoriteTalkUsers: favoriteTalkUsers,
          });

        }
        catch (err: any) {
          console.log(err);

          socket.emit('get-favorite-users-result', {
            // action: 'delete-group-member',
            message: 'Getting favorite users failed',
            error: { message: err.message, name: err.name }
          });
        }
 
      });

      socket.on('edit-favorite-users', async (data: any) => {
        console.log('edit-favorite-users data', data);
        
        const newFavoriteTalkUsers = data.favoriteTalkUsers;

        try {
          if (data.userId !== jwtUserId) {
            const error = new Error('not authenticated');
            error.name = 'authError';
            throw error;
          }

          const textTalk = await TextTalk.findOne({
            userId: data.userId,
          });

          if (!textTalk) {
            const error = new Error('Error, textTalk not found');
            // error.name = 'authError';
            throw error;
          }

          const uniqueList = _.uniqBy(newFavoriteTalkUsers, function(e: any) {
            return e.userId;
          });
    
          if (uniqueList.length !== newFavoriteTalkUsers.length) {
            const error = new Error('Error, something wrong, duplicate');
            // error.name = 'authError';
            throw error;
          }

          textTalk.favoriteTalkUsers = uniqueList;
          await textTalk.save();
    
          socket.emit('edit-favorite-users-result', {
            // action: 'delete-group-member',
            message: 'Editing favorite users success',
            favoriteTalkUsers: textTalk.favoriteTalkUsers,
          });

        }
        catch (err: any) {
          console.log(err);

          socket.emit('edit-favorite-users-result', {
            // action: 'delete-group-member',
            message: 'Editing favorite users failed',
            error: { message: err.message, name: err.name }
          });
        }
 
      });

      ////// group stuff

      // socket.on('create-group', async (data) => {
      //   console.log('create-group data', data);

      //   try {
      //     if (
      //       !data.groupName || 
      //       data.groupName.length < 5 || 
      //       data.groupName.length > 100
      //     ) {
      //       throw new Error(
      //         'group name should be 5-100 characters length'
      //       );
      //     }

      //     let newGroup;
        
      //     newGroup = await GroupTalk.findOne({
      //       creatorUserId: data.userId,
      //       groupName: data.groupName
      //     });

      //     if (!newGroup) {
      //       newGroup = await new GroupTalk({
      //         creatorUserId: data.userId,
      //         groupName: data.groupName,
      //         allMemberUserIds: [{
      //           userId: data.userId,
      //           addAt: Date.now()
      //         }],
      //         talk: [],
      //       });
      //       await newGroup.save();

      //       socket.emit('create-group-result', {
      //         group: newGroup,
      //         message: 'group created'
      //       });
      //     } 
      //     else {
      //       throw new Error('group creation failed. group already exist');
      //     }

      //   } catch(err) {
      //     console.log(err);

      //     socket.emit('create-group-result', {
      //       // group: '',
      //       message: err.message,
      //       error: { message: err.message }
      //     });
      //   }

      // });


      // socket.on('upgrade-group', async (data) => {
      //   console.log('upgrade-group data', data);

      //   try {
      //     if (
      //       !data.newGroupName || 
      //       data.newGroupName.length < 5 || 
      //       data.newGroupName.length > 100 ||
      //       data.newDescription && data.newDescription.length > 500
      //     ) {
      //       throw new Error(
      //         'group name should be 5-100 characters length, description should be less than 500 characters length'
      //       );
      //     }

      //     const group = await GroupTalk.findOne({
      //       creatorUserId: data.userId,
      //       groupName: data.previousGroupName
      //     });

      //     if (!group) {
      //       throw new Error('group does not exist');

      //     } 
      //     else {
      //       group.groupName = data.newGroupName;
      //       group.description = data.newDescription;
      //       await group.save();

      //       socket.emit('upgrade-group-result', {
      //         // group: '',
      //         message: 'group updated',
      //       });
      //     }

      //   } catch(err) {
      //     console.log(err);

      //     socket.emit('update-group-result', {
      //       // group: '',
      //       message: err.message,
      //       error: { message: err.message }
      //     });
      //   }

      // });


      // socket.on('join-group', async (data) => {
      //   console.log('join-group data', data);

       

      //   try {
      //     //// add userId in mdb once user joined group
      //     const joinedGroup = await GroupTalk.findOne({
      //       _id: data.groupRoomId
      //     });
          
      //     const isUserInIds = joinedGroup.allMemberUserIds.find((element: any)=> {
      //       return element.userId === data.user.userId;
      //     });

      //     if (!isUserInIds) {
      //       joinedGroup.allMemberUserIds = joinedGroup.allMemberUserIds.concat({
      //         userId: data.user.userId,
      //         addAt: Date.now(),
      //       });
      //       await joinedGroup.save();
      //     }



      //     const user = this.activeSocketsObj.find(element => {
      //       return element.userId === data.user.userId;
      //     });
  
  
      //     //// delete user if user is in other groups, delete user in other gourp
      //     if (this.activeGroups.length > 0) {
      //       let gRoomId: any;
      //       // let withoutUserGroupObj;
      //       let withoutUserActiveGroupsElement;
      //       let withoutUserMemberList = [];
      //       for (const group of this.activeGroups) {
    
      //         const isUserInMember = group.members.find((element: { userId: any; }) => {
      //           return element.userId === data.user.userId;
      //         });
      //         console.log('isUserInMember', isUserInMember);
    
      //         withoutUserMemberList = group.members.filter((element: { userId: any; }) => {
      //           return element.userId !== data.user.userId
      //         });
      //         console.log('withoutUserMemberList', withoutUserMemberList);
    
      //         if (isUserInMember) {
      //           gRoomId = group.groupRoomId;
    
      //           // withoutUserGroupObj = {
      //           //   _id: group._id,
      //           //   groupRoomId: group.groupRoomId,
      //           //   creatorUserId: group.creatorUserId,
      //           //   groupName: group.groupName,
      //           //   createdAt: group.createdAt,
      //           //   members: withoutUserMemberList 
                  
      //           // };
  
      //           withoutUserActiveGroupsElement = {
      //             _id: group._id,
      //             groupRoomId: group.groupRoomId,
      //             creatorUserId: group.creatorUserId,
      //             groupName: group.groupName,
      //             description: group.description,
      //             createdAt: group.createdAt,
      //             members: withoutUserMemberList 
      //           };
  
      //           console.log('gRoomId', gRoomId);
      //           // console.log('withoutUserGroupObj', withoutUserGroupObj);
      //         }
      //       }
    
      //       this.activeGroups = this.activeGroups.filter(element => {
      //         return element.groupRoomId !== gRoomId;
      //       });
    
      //       // if (withoutUserMemberList.length > 0) {
      //       //   this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
      //       // }
  
      //       if (withoutUserActiveGroupsElement) {
      //         // this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
      //         this.activeGroups = this.activeGroups.concat(withoutUserActiveGroupsElement);
      //       }
      //     }
  
  
  
  
  
  
          
  
      //     const group = this.activeGroups.find(element => {
      //       return element.groupRoomId === data.groupRoomId;
      //     });
      //     console.log('group', group);
  
  
  
      //     let userExist;
  
      //     if (group) {
      //       userExist = group.members.find((member: { userId: any; }) => {
      //         return member.userId === data.user.userId;
      //       });
      //       console.log('group.members', group.members);
      //       console.log('userExist', userExist);
      //     }
  
  
      //     if (group && !userExist) {
      //       //// leave from existing rooms except for own room, and join noconnect rooms
      //       for(const room in socket.rooms) {
      //         if(socket.id !== room) {
      //           socket.leave(room, () => {
      //             // console.log('after leave socket.rooms', socket.rooms);        
      //           })
      //         };
      //       }
  
    
      //       socket.join(group.groupRoomId, async () => {
    
      //         const userWithRooms = {
      //           socketId: user.socketId,
      //           userId: user.userId,
      //           userName: user.userName,
      //           userImageUrl: user.userImageUrl,
      //           connectAt: user.connectAt,
      //           groupRooms: socket.rooms
      //         }
      
      //         const listWithoutUser = this.activeSocketsObj.filter(element => {
      //           return element.userId !== user.userId;
      //         });
      
      //         this.activeSocketsObj = listWithoutUser.concat(userWithRooms);
              
      //         console.log('this.activeSocketsObj after room', this.activeSocketsObj)
      //         console.log('group.members', group.members, group);
              
  
  
      //         const groupTalk = await GroupTalk.findOne({
      //           _id: group.groupRoomId
      //         });
  
      //         const groupObj = {
      //           // _id: group._id,
      //           // groupRoomId: group.groupRoomId,
      //           // creatorUserId: group.creatorUserId,
      //           // groupName: group.groupName,
      //           // createdAt: group.createdAt,
      //           // members: group.members.concat(userWithRooms),
      //           // talks: group.talks,
  
      //           _id: groupTalk._id,
      //           creatorUserId: groupTalk.creatorUserId,
      //           groupName: groupTalk.groupName,
      //           description: groupTalk.description,
      //           createdAt: groupTalk.createdAt,
      //           talks: groupTalk.talks,
      //           allMemberUserIds: groupTalk.allMemberUserIds,
                
      //           groupRoomId: group.groupRoomId,
      //           // members: group.members.concat(userWithRooms),
      //         };
  
  
      //         const activeGroupsElement = {
      //           _id: group._id,
      //           groupRoomId: group.groupRoomId,
      //           creatorUserId: group.creatorUserId,
      //           groupName: group.groupName,
      //           description: group.description,
      //           createdAt: group.createdAt,
      //           members: group.members.concat(userWithRooms),
      //         }
  
      //         console.log('before listWithoutGroup this.activeGroups', this.activeGroups);
      //         console.log('this.activeGroups.lnengh', this.activeGroups.length);
      //         const listWithoutGroup = this.activeGroups.filter(element => {
      //           console.log('elemnet in listWithoutGroup', element);
      //           if (element && element.groupRoomId) {
      //             return element.groupRoomId !== group.groupRoomId;
      //           } 
      //         });
  
      //         // this.activeGroups = listWithoutGroup.concat(groupObj);
      //         this.activeGroups = listWithoutGroup.concat(activeGroupsElement);
      //         console.log('this.activeGrops', this.activeGroups);
    
      //         this.io.emit('update-group-list', {
      //         // socket.to(group.groupRoomId).emit('update-group-list', {
      //           groups: this.activeGroups,
      //         });
  
      //         socket.emit('join-group-result', {
      //           message: 'join group success'
      //         })
  
      //         socket.emit('update-group', {
      //           group: groupObj,
      //         });
  
      //         socket.to(group.groupRoomId).emit('update-group', {
      //           group: groupObj,
      //         });
    
      //       });
      //     }


      //   } catch(err) {
      //     console.log(err);

      //     socket.emit('join-group-result', {
      //       message: 'join group failed',
      //       error: {
      //         message: err.message
      //       }
      //     });
      //   }


      // });




      // socket.on('leave-group', async (data) => {
      //   console.log('leave-group data', data);

        
      //   //// delete user if user is in other groups, delete user in other gourp
      //   if (this.activeGroups.length > 0) {
      //     let gRoomId: any;
      //     let withoutUserGroupObj;
      //     let withoutUserActiveGroupsElement;
      //     let withoutUserMemberList = [];
      //     for (const group of this.activeGroups) {
  
      //       const isUserInMember = group.members.find((element: { userId: any; }) => {
      //         return element.userId === data.user.userId;
      //       });
      //       console.log('isUserInMember', isUserInMember);
  
      //       withoutUserMemberList = group.members.filter((element: { userId: any; }) => {
      //         return element.userId !== data.user.userId
      //       });
      //       console.log('withoutUserMemberList', withoutUserMemberList);
  
      //       if (isUserInMember) {
      //         gRoomId = group.groupRoomId;
  

      //         const groupTalk = await GroupTalk.findOne({
      //           _id: group.groupRoomId
      //         });

      //         withoutUserGroupObj = {
      //           // groupRoomId: group.groupRoomId,
      //           // createUserId: group.creatorUserId,
      //           // groupName: group.groupName,
      //           // members: withoutUserMemberList,
      //           // talks: group.talks,  

      //           _id: groupTalk._id,
      //           creatorUserId: groupTalk.creatorUserId,
      //           groupName: groupTalk.groupName,
      //           description: groupTalk.description,
      //           createdAt: groupTalk.createdAt,
      //           talks: groupTalk.talks,
      //           allMemberUserIds: groupTalk.allMemberUserIds,
                
      //           groupRoomId: group.groupRoomId,
      //           // members: withoutUserMemberList,
      //         };


      //         withoutUserActiveGroupsElement = {
      //           _id: group._id,
      //           groupRoomId: group.groupRoomId,
      //           creatorUserId: group.creatorUserId,
      //           groupName: group.groupName,
      //           description: group.description,
      //           createdAt: group.createdAt,
      //           members: withoutUserMemberList,
      //         }

      //         console.log('gRoomId', gRoomId);
      //         console.log('withoutUserGroupObj', withoutUserGroupObj);
      //       }
      //     }
  
      //     this.activeGroups = this.activeGroups.filter(element => {
      //       return element.groupRoomId !== gRoomId;
      //     });
  
      //     // if (withoutUserMemberList.length > 0) {
      //     //   this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
      //     // }
  
      //     if (withoutUserActiveGroupsElement) {
      //       // this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
      //       this.activeGroups = this.activeGroups.concat(withoutUserActiveGroupsElement);
      //     }




      //     for(const room in socket.rooms) {
      //       if(socket.id !== room) {
      //         socket.leave(room, () => {
      //         })
      //       };
      //     }

      //     const user = this.activeSocketsObj.find(element => {
      //       return element.userId === data.user.userId;
      //     });

      //     const userWithOutRooms = {
      //       socketId: user.socketId,
      //       userId: user.userId,
      //       userName: user.userName,
      //       userImageUrl: user.userImageUrl,
      //       connectAt: user.connectAt,
      //       // groupRooms: socket.rooms
      //     }
  
      //     const listWithoutUser = this.activeSocketsObj.filter(element => {
      //       return element.userId !== user.userId;
      //     });
  
      //     this.activeSocketsObj = listWithoutUser.concat(userWithOutRooms);



      //     this.io.emit('update-group-list', {
      //       // socket.emit('update-group-list', {
      //         groups: this.activeGroups,
      //     });

      //     socket.to(gRoomId).emit('update-group', {
      //       group: withoutUserGroupObj,
      //     });
      //   }

      // })




      // socket.on('get-group-list', async (data) => {
      //   console.log('get-group-list data', data);


      //   const groupList = await GroupTalk.find({});

      //   const returnList = [];
      //   for (const ele of groupList) {

      //     const groupInActiveGroups = this.activeGroups.find(element => {
      //       return element.groupRoomId === ele._id.toString();
      //     });

      //     if (groupInActiveGroups) {
      //       returnList.push({
      //         _id: ele._id.toString(),
      //         groupRoomId: ele._id.toString(),
      //         creatorUserId: ele.creatorUserId,
      //         groupName: ele.groupName,
      //         description: ele.description,
      //         createdAt: ele.createdAt,
      //         members: groupInActiveGroups.members.length > 0 ? groupInActiveGroups.members : [],
      //       });
      //     } else {
      //       returnList.push({
      //         _id: ele._id.toString(),
      //         groupRoomId: ele._id.toString(),
      //         creatorUserId: ele.creatorUserId,
      //         groupName: ele.groupName,
      //         description: ele.description,
      //         createdAt: ele.createdAt,
      //         members: [],
      //       });
      //     }
      //   };

      //   this.activeGroups = returnList;
        
      //   console.log('this.activeGroups', this.activeGroups)
      //   socket.emit('update-group-list', {
      //       groups: this.activeGroups,
      //       // gruops: returnList,
      //     });
      // })


      // socket.on('get-group-info', async (data) => {
      //   console.log('get-group-info data', data);


      //   const groupInfo = await GroupTalk.findById(data.groupRoomId);

      //   console.log('groupInfo', groupInfo);

      //   const groupInActiveGroups = this.activeGroups.find(element => {
      //     return element.groupRoomId === data.groupRoomId;
      //   });

      //   const groupObj = {
      //       _id: groupInfo._id,
      //       creatorUserId: groupInfo.creatorUserId,
      //       groupName: groupInfo.groupName,
      //       description: groupInfo.description,
      //       createdAt: groupInfo.createdAt,
      //       talks: groupInfo.talks,
      //       allMemberUserIds: groupInfo.allMemberUserIds,

      //       groupRoomId: data.groupRoomId,
      //       // members: group.members,
      //   }

      //   socket.emit('update-group', {
      //     group: groupObj,
      //   });

      // })



      // socket.on('group-text-send', async (data) => {
      //   console.log('group-text-send, data', data);

      //   try {
      //     const groupTalk = await GroupTalk.findOne({
      //       _id: data.groupRoomId
      //     });
  
      //     console.log('groupTalk', groupTalk);
  
      //     if (groupTalk) {
      //       groupTalk.talks.push(data);
      //       await groupTalk.save();
  
      //       const group = this.activeGroups.find(element => {
      //         return element.groupRoomId = data.groupRoomId;
      //       });
  
      //       console.log('group', group);
      //       console.log('this.activeGroups', this.activeGroups);
            
      //       const groupObj = {
      //         _id: groupTalk._id,
      //         creatorUserId: groupTalk.creatorUserId,
      //         groupName: groupTalk.groupName,
      //         description: groupTalk.description,
      //         createdAt: groupTalk.createdAt,
      //         talks: groupTalk.talks,
      //         allMemberUserIds: groupTalk.allMemberUserIds,
  
      //         groupRoomId: group.groupRoomId,
      //         // members: group.members,
      //       };
  
      //       socket.emit('update-group', {
      //         group: groupObj,
      //       });
  
      //       socket.to(data.groupRoomId).emit('update-group', {
      //         group: groupObj,
      //       });
  
      //     }

      //     const idsForPush = [];

      //     for (const ele of groupTalk.allMemberUserIds) {
      //       if (ele.userId !== data.fromUserId) {
      //         idsForPush.push(ele.userId);
      //       }
      //     }
 
      //     socket.emit('group-text-send-result', {
      //       message: 'group text send success',
      //       idsForPush: idsForPush,
      //       textData: data
      //     });

      //   } 
      //   catch(err) {
      //     console.log(err);

      //     socket.emit('group-text-send-result', {
      //       message: 'group text send failed',
      //       error: {
      //         message: err.messge
      //       }
      //     });
      //   }



      //   //   //// toUser in noconnect-talk and not noconnect-talk with user, start push notify user textdata
      //   //   if (destUser.socketRooms) {
      //   //     if (!destUser.socketRooms[room1] || !destUser.socketRooms[room2]) {
      //   //       // console.log('destUser.socketRooms && !destUser.socketRooms[room1] || !destUser.socketRooms[room2]');

      //   //       socket.emit('send-text-forPush', {
      //   //         text: userDestTalk.text[userDestTalk.text.length -1]
      //   //       });
      //   //     }
      //   //   }

      //   //   //// toUser online but not in rooms, start push notify textdata
      //   //   if (!destUser.socketRooms) {
      //   //     socket.emit('send-text-forPush', {
      //   //       text: userDestTalk.text[userDestTalk.text.length -1]
      //   //     });
      //   //   }

      //   //   else {

      //   //   socket.emit('send-text-forPush', {
      //   //     text: userDestTalk.text[userDestTalk.text.length -1]
      //   //   });
      //   // }
 
      // });


      // socket.on('delete-group', async (data) => {
      //   try {

      //     const groupTalk = await GroupTalk.findOne({
      //       _id: data.groupRoomId
      //     });

      //     if (groupTalk.creatorUserId !== data.user.userId) {
      //       throw new Error('deletion failed, only creator can delete group');
      //     }

      //     await GroupTalk.deleteOne({ _id: data.groupRoomId });


      //     this.activeGroups = this.activeGroups.filter(element => {
      //       return element.groupRoomId !== data.groupRoomId;
      //     });

      //     this.io.emit('update-group-list', {
      //       // socket.emit('update-group-list', {
      //         groups: this.activeGroups,
      //     });

      //     socket.emit('delete-group-result', {
      //       // action: 'delete-group-member',
      //       message: 'delete group success',
      //       // groupRoomId: data.groupRoomId
      //     });


      //   } catch(err) {
      //     console.log(err);

      //     socket.emit('delete-group-result', {
      //       // action: 'delete-group-member',
      //       message: 'delete group failed',
      //       error : {
      //         message: err.message
      //       }
      //     });
      //   }

      // });

      // socket.on('delete-group-member', async (data) => {

      //   try {
      //     const groupTalk = await GroupTalk.findOne({
      //       _id: data.groupRoomId
      //     });

      //     if (groupTalk.creatorUserId === data.deleteUserId) {
      //       throw new Error('cannot delete group creator');
      //     }
  
      //     const group = this.activeGroups.find(element => {
      //       return element.groupRoomId = data.groupRoomId;
      //     });
          
      //     // console.log('groupTalk.allMemberUserIds', groupTalk.allMemberUserIds)
      //     const withoutUserAllMemberIds = groupTalk.allMemberUserIds.filter((element: any) => {
      //       return element.userId !== data.deleteUserId;
      //     });

      //     // console.log('withoutUserAllMemberIds', withoutUserAllMemberIds)

      //     groupTalk.allMemberUserIds = withoutUserAllMemberIds;
      //     await groupTalk.save();
  
      //     const groupObj = {
      //       _id: groupTalk._id,
      //       creatorUserId: groupTalk.creatorUserId,
      //       groupName: groupTalk.groupName,
      //       description: groupTalk.description,
      //       createdAt: groupTalk.createdAt,
      //       talks: groupTalk.talks,
      //       allMemberUserIds: withoutUserAllMemberIds,
  
      //       groupRoomId: group.groupRoomId,
      //       // members: group.members,
      //     };
  
      //     socket.emit('delete-group-member-result', {
      //       // action: 'delete-group-member',
      //       message: 'delete member success',
      //       // groupRoomId: data.groupRoomId
      //     });

      //     socket.to(data.groupRoomId).emit('update-group', {
      //       group: groupObj,
      //     });


      //   } catch(err) {
      //     console.log(err);

      //     socket.emit('delete-group-member-result', {
      //       // action: 'delete-group-member',
      //       message: err.message,
      //       error : {
      //         message: err.message
      //       }
      //     });
      //   }

      // })


    });

  }


  public listen(callback: (port: number) => void): void {
    // this.httpServer.listen(this.DEFAULT_PORT, () => {
    //   callback(this.DEFAULT_PORT);
    // });

    const port = Number(process.env.PORT) || 4001;

    this.httpServer.listen(port, () => {
      callback(port);
    });

    // console.log(sticky);

    // if (!sticky.listen(this.httpServer, this.DEFAULT_PORT)) {
    //   // Master code
    //   const port = this.DEFAULT_PORT
    //   this.httpServer.once('listening', function() {
    //     console.log(`server started on  ${port} port`);
    //   });

    // } else {
    //   // Worker code
    // }

  }

  // public getIo(): any {
  //   if (!this.io) {
  //     throw new Error('Socket.io not initialized!');
  // }
  // // console.log('this.io', this.io);
  // return this.io;
  // }
}