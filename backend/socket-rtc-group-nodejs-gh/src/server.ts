const path = require('path');
const express = require('express');
import { Application } from "express";
const socketIO = require('socket.io');
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { group } from "console";
const bodyParser = require('body-parser');
const socketRedis = require('socket.io-redis');
// const Redis = require('ioredis');
// const redis = require('redis');

// const TextTalk = require('./models/text-talk');
const GroupUser = require('./models/group-user');
const GroupTalk = require('./models/group-talk');
const GroupConnection = require('./models/group-connection');

// const TestRoutes = require('./routes/test');
const groupTalkRoutes = require('./routes/group-talk');
const groupPushRoutes = require('./routes/group-push');
const fileUploadRoutes = require('./routes/file-upload');
const groupUserRoutes = require('./routes/group-user');

const { authUserId } = require('./util/auth');

// const { handlePushNotification } = require('./handle-push');
const { 
  handleGroupTextSend,
  handleGroupTextDelete, 
  handleCreateGroupTextReaction, 
  handleGetGroupTextReactions 
} = require('./handle-text');
const { handleEditGroup, handleDeleteGroup, handleGetGroup } = require('./handle-edit-group');
const { handleDeleteGroupMember } = require('./handle-group-member');
const { handleGroupUser } = require('./handle-user');
const { createReturnPost } = require('./util/file-upload-utils');

require('dotenv').config();


export interface groupElement {
  _id: string,
  creatorUserId: string,
  groupName: string,
  description?: string,
  createdAt: string,
  talks: any[],
  allMemberUserIds: any[],
  language: string,
  keywords: string[],
  tags: string[],
  totalVisits: number,

  groupRoomId: string,
}

interface activeGroupsElement {
  _id: string,
  groupRoomId: string,
  creatorUserId: string,
  groupName: string,
  description?: string,
  createdAt: string,
  members: any[],
  language: string,
  keywords: string[],
  tags: string[],
  allMemberUserIds: object[],
  totalVisits: number,
}

//// user info object
interface activeSocketsElement {
  socketId: string,
  userId: string,
  userName: string,
  userImageUrl?: string,
  connectAt: string,
}

export interface GroupTextInfo {
  from: string,
  fromUserId: string,
  text: string,
  fromName: string,
  groupRoomId: string,
  sendAt: number,
  language: string,
  geolocation: any,
  fileUrls? : string[],
  filePaths?: string[],
  fileSizes?: string[],
  
  token?: string,
  groupName?: string,
  textId?: string,
}


export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private activeSockets: string[] = [];
  private activeSocketsObj: any[] = [];
  private activeGroups: any[] = [];

  private userObj: any = {};

  private textList: object[] = [];


  private readonly DEFAULT_PORT = 4002;

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
    // this.io.adapter(socketRedis({ host: 'redis-srg', port: 6379 }));

    

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

      
      //// for deploy
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      //// for dev
      res.setHeader('Access-Control-Allow-Origin', '*');


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

    // console.log('group-files path', path.join('', 'group-files'))
    this.app.use('/group-files', express.static(path.join('', 'group-files')));
    
    // this.app.use('/test', TestRoutes);
    this.app.use('/group-talk', groupTalkRoutes);
    this.app.use('/group-push', groupPushRoutes);
    this.app.use('/file-upload', fileUploadRoutes);
    this.app.use('/group-user', groupUserRoutes);

    // this.app.get("/", (req, res) => {
    //   res.sendFile("index.html");
    // });

    this.app.get("/xxx", (req, res) => {
      // res.sendFile("index.html");
      res.send("hello world express socket.io group");
    });

    this.app.get("/healthz", (req, res) => {
      // res.sendFile("index.html");
      res.send("hello world express socket.io healthz");
    });

    this.app.get("/", (req, res) => {
      res.send("hello world express socket gp /");
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

    this.io.on("connection", socket => {
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

        // socketConnection = await TextTalk.findOne({
        socketConnection = await GroupUser.findOne({
          userId: user.userId,
        });

        if (!socketConnection) {
          // socketConnection = await new TextTalk({ userId: user.userId });
          // socketConnection = await new TextTalk({
          socketConnection = await new GroupUser({
            userId: user.userId,
            talk: {
              pairId: `${user.userId}-${data.destUser.userId}`,
              text: []
            },
            connection: [],
          });

          await socketConnection.save();
        }

        // const talkWithDest = await TextTalk.findOne({
        const talkWithDest = await GroupUser.findOne({
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

        // destConnection = await TextTalk.findOne({
        destConnection = await GroupUser.findOne({
          userId: data.destUser.userId,
        });

        if (!destConnection) {        
          // destConnection = await new TextTalk({
          destConnection = await new GroupUser({
            userId: data.destUser.userId,
            talk: {
              pairId: `${data.destUser.userId}-${user.userId}`,
              text: []
            },
            connection: [],
          });

          await destConnection.save();
        }

        // const talkWithUser = await TextTalk.findOne({
        const talkWithUser = await GroupUser.findOne({
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

        // const findConnection = await socketConnection.connection.find((element: any) => {
        //   // console.log(element);
        //   return element.socketId === socket.id;
        // });
        // console.log('findConnection', findConnection);

        // findConnection.callTo.push({
        //   socketId: data.destUser.socketId,
        //   userId: data.destUser.userId,
        //   userName: data.destUser.userName,
        //   connectAt: data.destUser.connectAt,
        //   talkStartAt: talkStartAt && talkStartAt, //// save in one user to identify which recieved call
        //   createAt: Date.now(),
        //   // disconnectAt:
        // });
        // await socketConnection.save();


        //// get taxt-talk data
        let textTalkOne;

        // textTalkOne = await TextTalk.findOne({
        textTalkOne = await GroupUser.findOne({
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


            // const groupConnection = await GroupConnection.findOne({
            //   userId: user.userId,
            //   socketId: socket.id,
            // });
            // console.log('groupConection', groupConnection);

            // if (groupConnection) {
            //   groupConnection.disconnectAt = nowTime;
            //   await groupConnection.save();
            // }

          }
        });



        if (this.activeGroups.length > 0) {
          let trimGroups = [];
          for (const group of this.activeGroups) {
            if (group && group.groupRoomId) {
              trimGroups.push(group);
            }
          }
          this.activeGroups = trimGroups;
        }


        if (this.activeGroups.length > 0) {
          //// delete user if user is in other groups, delete user in other gourp
          let gRoomId: any;
          let withoutUserGroupObj;
          let withoutUserActiveGroupsElement;
          let withoutUserMemberList = [];

          for (const group of this.activeGroups) {
              // console.log('group', group);
           
              if (group && group.members && group.members.length > 0) {

                const isUserInMember = group.members.find((element: { userId: any; }) => {
                  return element.userId === user.userId;
                });
                // console.log('isUserInMember', isUserInMember);
      
                withoutUserMemberList = group.members.filter((element: { userId: any; }) => {
                  return element.userId !== user.userId
                });
                // console.log('withoutUserMemberList', withoutUserMemberList);
      
                if (isUserInMember) {
                  gRoomId = group.groupRoomId;
      
                  // withoutUserGroupObj = {
                  //   groupRoomId: group.groupRoomId,
                  //   createUserId: group.creatorUserId,
                  //   groupName: group.groupName,
                  //   members: withoutUserMemberList  
                  // };


                  const groupTalk = await GroupTalk.findOne({
                    _id: group.groupRoomId
                  });
      
                  const groupObj: groupElement = {
                    // _id: group._id,
                    // groupRoomId: group.groupRoomId,
                    // creatorUserId: group.creatorUserId,
                    // groupName: group.groupName,
                    // createdAt: group.createdAt,
                    // members: group.members.concat(userWithRooms),
                    // talks: group.talks,
      
                    _id: groupTalk._id,
                    creatorUserId: groupTalk.creatorUserId,
                    groupName: groupTalk.groupName,
                    description: groupTalk.description,
                    createdAt: groupTalk.createdAt,
                    talks: groupTalk.talks,
                    allMemberUserIds: groupTalk.allMemberUserIds,
                    language: groupTalk.language,
                    keywords: groupTalk.keywords,
                    tags: groupTalk.tags,
                    totalVisits: groupTalk.totalVisits,

                    groupRoomId: group.groupRoomId,
                    // members: withoutUserMemberList,
                  }

                  withoutUserGroupObj = groupObj;


                  const addObj: activeGroupsElement = {
                    _id: group._id,
                    groupRoomId: group.groupRoomId,
                    creatorUserId: group.creatorUserId,
                    groupName: group.groupName,
                    description: group.description,
                    createdAt: group.createdAt,
                    members: withoutUserMemberList,
                    language: group.language,
                    keywords: group.keywords,
                    tags: group.tags,
                    allMemberUserIds: group.allMemberUserIds,
                    totalVisits: group.totalVisits,
                  }

                  withoutUserActiveGroupsElement = addObj;
  
                }

              }

            
          }
  
          this.activeGroups = this.activeGroups.filter(element => {
              return element.groupRoomId !== gRoomId;
          });
  
          // if (withoutUserMemberList.length > 0) {
          //   this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
          // }
          if (withoutUserActiveGroupsElement) {
            // this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
            this.activeGroups = this.activeGroups.concat(withoutUserActiveGroupsElement);
          }

          console.log('this.activeGroups in disconnect', this.activeGroups);

          this.io.emit('update-group-list', {
            // socket.emit('update-group-list', {
              groups: this.activeGroups,
          });

          if (gRoomId && withoutUserGroupObj) {
            const fileUrlsTalks = withoutUserGroupObj.talks.map((talk: GroupTextInfo) => {
              return createReturnPost(talk);
            });
  
            const fileUrlsGroupObj = {
              ...withoutUserGroupObj,
              talks: fileUrlsTalks,
            }

            socket.to(gRoomId).emit('update-group', {
              // group: withoutUserGroupObj,
              group: fileUrlsGroupObj,
            });
          }
        }



      });



      // socket.on("user-removed", (data) => {
      //   console.log('user-removed', data);
      // })

      socket.on('hey', () => {
        console.log('hey received');
      });

      socket.on('user-info', async (data) => {
        console.log('user-info data', data);

        const userInfoObj: activeSocketsElement = {
          socketId: data.socketId,
          userId: data.userId,
          userName: data.userName,
          userImageUrl: data.userImageUrl,
          connectAt: data.connectAt,
        }

        // this.userObj = data;
        
        if (data.token) {
          const jwtUserId = await authUserId(data.token);
          if (data.userId !== jwtUserId) {
            const error = new Error('Error, not authenticated');
            error.name = 'authError';
            throw error;
          }
        } 
        else {
          if (!data.userId.startsWith('na-')) {
            throw new Error('Error, invalid userId');
          }
        }

        let socketConnection;

        // socketConnection = await TextTalk.findOne({
        socketConnection = await GroupUser.findOne({
          userId: data.userId,
        });

        // console.log(data.userId)

        // if (!socketConnection) {
        if (!socketConnection && !data.userId.startsWith('na-')) {
          // socketConnection = await new TextTalk({
          socketConnection = await new GroupUser({
            userId: data.userId,
          });
          await socketConnection.save();

          // socketConnection.connection.push({
          //   socketId: socket.id,
          //   connectAt: data.connectAt
          // });
          // await socketConnection.save();


          //// store connection info
          const groupConnectoin =  await new GroupConnection({
            userId: data.userId,
            socketId: socket.id,
            connectAt: data.connectAt,
            // disconnectAt: 0,
          });
          await groupConnectoin.save();

        } else {
          // const findSocket = await TextTalk.findOne({
          const findSocket = await GroupUser.findOne({
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
            const groupConnectoin =  await new GroupConnection({
              userId: data.userId,
              socketId: socket.id,
              connectAt: data.connectAt,
              disconnectAt: 0
            });
            await groupConnectoin.save();

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

          // this.activeSocketsObj = withoutUserList.concat(data);
          this.activeSocketsObj = withoutUserList.concat(userInfoObj);
          // this.activeSocketsObj.push(data);

          // this.io.emit('new-user-info', {
          //   newUser: data,
          //   // usersObj: this.activeSocketsObj,
          // });

          socket.broadcast.emit('new-user-info', {
            // newUser: data,
            newUser: userInfoObj,
            // usersObj: this.activeSocketsObj,
          });

          socket.broadcast.emit('ask-usersObj', {
            // askUser: data,
            askUser: userInfoObj,
            // usersObj: this.activeSocketsObj,
          });

        }

        if (findNewUser && isSocket) {
          // const withoutOldUser = this.activeSocketsObj.filter(element => {
          //   return element.userId !== data.userId;
          // });

          // this.activeSocketsObj = withoutUserList.concat(data);
          this.activeSocketsObj = withoutUserList.concat(userInfoObj);

          // this.io.emit('new-user-info', {
          //   newUser: data,
          //   // usersObj: this.activeSocketsObj,
          // });

          socket.broadcast.emit('new-user-info', {
            // newUser: data,
            newUser: userInfoObj,
            // usersObj: this.activeSocketsObj,
          });

          socket.broadcast.emit('ask-usersObj', {
            // askUser: data,
            aslUser: userInfoObj,
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

        // console.log('this.activeSockets', this.activeSockets);

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
            // const userObj = {
            //   socketId: data.newUser.socketId,
            //   userId: data.newUser.userId,
            //   userName: data.newUser.userName,
            //   userImageUrl: data.newUser.userImageUrl,
            //   connectAt: data.newUser.connectAt,
            // }
            // this.activeSocketsObj = withoutOldUser.concat(userObj);

            const userInfoObj: activeSocketsElement = {
              socketId: data.newUser.socketId,
              userId: data.newUser.userId,
              userName: data.newUser.userName,
              userImageUrl: data.newUser.userImageUrl,
              connectAt: data.newUser.connectAt,
            };
            // console.log('userInfoObj', userInfoObj);

            this.activeSocketsObj = withoutOldUser.concat(userInfoObj);
            // this.activeSocketsObj = withoutOldUser.concat(data.newUser);

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








      ////// group stuff

      //// handle create and edit group
      handleEditGroup(socket);

      //// handle group deletion
      handleDeleteGroup(socket);

      //// handle get a group info
      handleGetGroup(socket);

      //// handle group send text, delete text;
      handleGroupTextSend(socket);
      handleGroupTextDelete(socket);

      //// handle group text reactions
      handleCreateGroupTextReaction(socket);
      handleGetGroupTextReactions(socket);

      // //// handle push notification when text send success.
      // handlePushNotification(socket);

      //// handle delete group member
      handleDeleteGroupMember(socket);

      //// handle group user info
      handleGroupUser(socket);







      socket.on('join-group', async (data) => {
        console.log('join-group data', data);

        try {
          const jwtUserId = await authUserId(data.token);

          if (!jwtUserId || data.user.userId !== jwtUserId) {
            const error = new Error('Error, not authenticated');
            error.name = 'authError';
            throw error;
          }

          //// add userId in mdb once user joined group
          const joinedGroup = await GroupTalk.findOne({
            _id: data.groupRoomId
          });
          
          const isUserInIds = joinedGroup.allMemberUserIds.find((element: any)=> {
            return element.userId === data.user.userId;
          });

          if (!isUserInIds) {
            joinedGroup.allMemberUserIds = joinedGroup.allMemberUserIds.concat({
              userId: data.user.userId,
              addAt: Date.now(),
            });
            await joinedGroup.save();
          }



          const user = this.activeSocketsObj.find(element => {
            return element.userId === data.user.userId;
          });
  
  
          //// delete user if user is in other groups, delete user in other gourp
          if (this.activeGroups.length > 0) {
            let gRoomId: any;
            // let withoutUserGroupObj;
            let withoutUserActiveGroupsElement;
            let withoutUserMemberList = [];
            for (const group of this.activeGroups) {
    
              const isUserInMember = group.members.find((element: { userId: any; }) => {
                return element.userId === data.user.userId;
              });
              console.log('isUserInMember', isUserInMember);
    
              withoutUserMemberList = group.members.filter((element: { userId: any; }) => {
                return element.userId !== data.user.userId
              });
              console.log('withoutUserMemberList', withoutUserMemberList);
    
              if (isUserInMember) {
                gRoomId = group.groupRoomId;
    
                // withoutUserGroupObj = {
                //   _id: group._id,
                //   groupRoomId: group.groupRoomId,
                //   creatorUserId: group.creatorUserId,
                //   groupName: group.groupName,
                //   createdAt: group.createdAt,
                //   members: withoutUserMemberList 
                  
                // };
  
                const addObj: activeGroupsElement = {
                  _id: group._id,
                  groupRoomId: group.groupRoomId,
                  creatorUserId: group.creatorUserId,
                  groupName: group.groupName,
                  description: group.description,
                  createdAt: group.createdAt,
                  members: withoutUserMemberList,
                  language: group.language,
                  keywords: group.keywords,
                  tags: group.tags,
                  allMemberUserIds: group.allMemberUserIds,
                  totalVisits: group.totalVisits,
                }

                withoutUserActiveGroupsElement = addObj;
  
                console.log('gRoomId', gRoomId);
                // console.log('withoutUserGroupObj', withoutUserGroupObj);
              }
            }
    
            this.activeGroups = this.activeGroups.filter(element => {
              return element.groupRoomId !== gRoomId;
            });
    
            // if (withoutUserMemberList.length > 0) {
            //   this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
            // }
  
            if (withoutUserActiveGroupsElement) {
              // this.activeGroups = this.activeGroups.concat(withoutUserGroupObj);
              this.activeGroups = this.activeGroups.concat(withoutUserActiveGroupsElement);
            }
          }
  
  
  
  
  
  
          
  
          const group = this.activeGroups.find(element => {
            return element.groupRoomId === data.groupRoomId;
          });
          console.log('group', group);
  
  
  
          let userExist;
  
          if (group) {
            userExist = group.members.find((member: { userId: any; }) => {
              return member.userId === data.user.userId;
            });
            console.log('group.members', group.members);
            console.log('userExist', userExist);
          }
  
  
          if (group && !userExist) {
            //// leave from existing rooms except for own room, and join noconnect rooms
            for(const room in socket.rooms) {
              if(socket.id !== room) {
                socket.leave(room, () => {
                  // console.log('after leave socket.rooms', socket.rooms);        
                })
              };
            }
  
    
            socket.join(group.groupRoomId, async () => {
    
              const userWithRooms = {
                socketId: user.socketId,
                userId: user.userId,
                userName: user.userName,
                userImageUrl: user.userImageUrl,
                connectAt: user.connectAt,
                // groupRooms: socket.rooms
                // token: 'dummy-token'
              }
              const userInfoObj: activeSocketsElement = {
                socketId: user.socketId,
                userId: user.userId,
                userName: user.userName,
                userImageUrl: user.userImageUrl,
                connectAt: user.connectAt,
              }
      
              const listWithoutUser = this.activeSocketsObj.filter(element => {
                return element.userId !== user.userId;
              });
      
              // this.activeSocketsObj = listWithoutUser.concat(userWithRooms);
              this.activeSocketsObj = listWithoutUser.concat(userInfoObj);
              
              console.log('this.activeSocketsObj after room', this.activeSocketsObj)
              console.log('group.members', group.members, group);
              
  
  
              const groupTalk = await GroupTalk.findOne({
                _id: group.groupRoomId
              });
  
              const groupObj: groupElement = {
                // _id: group._id,
                // groupRoomId: group.groupRoomId,
                // creatorUserId: group.creatorUserId,
                // groupName: group.groupName,
                // createdAt: group.createdAt,
                // members: group.members.concat(userWithRooms),
                // talks: group.talks,
  
                _id: groupTalk._id,
                creatorUserId: groupTalk.creatorUserId,
                groupName: groupTalk.groupName,
                description: groupTalk.description,
                createdAt: groupTalk.createdAt,
                talks: groupTalk.talks,
                allMemberUserIds: groupTalk.allMemberUserIds,
                language: groupTalk.language,
                keywords: groupTalk.keywords,
                tags: groupTalk.tags,
                totalVisits: groupTalk.totalVisits,

                groupRoomId: group.groupRoomId,
                // members: group.members.concat(userWithRooms),
              };
  
  
              const addObj: activeGroupsElement = {
                _id: group._id,
                groupRoomId: group.groupRoomId,
                creatorUserId: group.creatorUserId,
                groupName: group.groupName,
                description: group.description,
                createdAt: group.createdAt,
                members: group.members.concat(userWithRooms),
                language: group.language,
                keywords: group.keywords,
                tags: group.tags,
                allMemberUserIds: group.allMemberUserIds,
                totalVisits: group.totalVisits,
              }
  
              console.log('before listWithoutGroup this.activeGroups', this.activeGroups);
              console.log('this.activeGroups.lnengh', this.activeGroups.length);
              const listWithoutGroup = this.activeGroups.filter(element => {
                console.log('elemnet in listWithoutGroup', element);
                if (element && element.groupRoomId) {
                  return element.groupRoomId !== group.groupRoomId;
                } 
              });
  
              // this.activeGroups = listWithoutGroup.concat(groupObj);
              this.activeGroups = listWithoutGroup.concat(addObj);
              console.log('this.activeGrops', this.activeGroups);
    
              this.io.emit('update-group-list', {
              // socket.to(group.groupRoomId).emit('update-group-list', {
                groups: this.activeGroups,
              });
  
              socket.emit('join-group-result', {
                message: 'join group success'
              })


              
              const fileUrlsTalks = groupObj.talks.map((talk: GroupTextInfo) => {
                return createReturnPost(talk);
              });
    
              const fileUrlsGroupObj = {
                ...groupObj,
                talks: fileUrlsTalks,
              }
  
              socket.emit('update-group', {
                // group: groupObj,
                group: fileUrlsGroupObj,
              });
  
              socket.to(group.groupRoomId).emit('update-group', {
                // group: groupObj,
                group: fileUrlsGroupObj,
              });
    
            });
          }


        } catch(err: any) {
          console.log(err);

          socket.emit('join-group-result', {
            message: 'join group failed',
            error: { message: err.message, name: err.name }
          });
        }


      });




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

      //         const groupObj: groupElement = {
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
      //           language: groupTalk.language,
      //           keywords: groupTalk.keywords,

      //           groupRoomId: group.groupRoomId,
      //           // members: withoutUserMemberList,
      //         }

      //         withoutUserGroupObj = groupObj;


      //         const addObj: activeGroupsElement = {
      //           _id: group._id,
      //           groupRoomId: group.groupRoomId,
      //           creatorUserId: group.creatorUserId,
      //           groupName: group.groupName,
      //           description: group.description,
      //           createdAt: group.createdAt,
      //           members: withoutUserMemberList,
      //           language: group.langugae,
      //           keywords: group.keywords,
      //         }

      //         withoutUserActiveGroupsElement = addObj

      //         // console.log('gRoomId', gRoomId);
      //         // console.log('withoutUserGroupObj', withoutUserGroupObj);
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

      //     const userInfoObj: activeSocketsElement = {
      //       socketId: user.socketId,
      //       userId: user.userId,
      //       userName: user.userName,
      //       userImageUrl: user.userImageUrl,
      //       connectAt: user.connectAt,
      //     }
  
      //     const listWithoutUser = this.activeSocketsObj.filter(element => {
      //       return element.userId !== user.userId;
      //     });
  
      //     this.activeSocketsObj = listWithoutUser.concat(userInfoObj);
      //     // this.activeSocketsObj = listWithoutUser.concat(userWithOutRooms);



      //     this.io.emit('update-group-list', {
      //       // socket.emit('update-group-list', {
      //         groups: this.activeGroups,
      //     });

      //     socket.to(gRoomId).emit('update-group', {
      //       group: withoutUserGroupObj,
      //     });
      //   }

      // });




      socket.on('get-group-list', async (data) => {
        console.log('get-group-list data', data);


        const groupList = await GroupTalk.find({});

        const returnList = [];
        for (const ele of groupList) {

          const groupInActiveGroups = this.activeGroups.find(element => {
            return element.groupRoomId === ele._id.toString();
          });


          let addObj: activeGroupsElement;

          if (groupInActiveGroups) {
            addObj = {
              _id: ele._id.toString(),
              groupRoomId: ele._id.toString(),
              creatorUserId: ele.creatorUserId,
              groupName: ele.groupName,
              description: ele.description,
              createdAt: ele.createdAt,
              members: groupInActiveGroups.members.length > 0 ? groupInActiveGroups.members : [],
              language: ele.language,
              keywords: ele.keywords,
              tags: ele.tags,
              allMemberUserIds: ele.allMemberUserIds,
              totalVisits: ele.totalVisits,
            };
            returnList.push(addObj);

            // returnList.push({
            //   _id: ele._id.toString(),
            //   groupRoomId: ele._id.toString(),
            //   creatorUserId: ele.creatorUserId,
            //   groupName: ele.groupName,
            //   description: ele.description,
            //   createdAt: ele.createdAt,
            //   members: groupInActiveGroups.members.length > 0 ? groupInActiveGroups.members : [],
            // });
          } else {
            addObj = {
              _id: ele._id.toString(),
              groupRoomId: ele._id.toString(),
              creatorUserId: ele.creatorUserId,
              groupName: ele.groupName,
              description: ele.description,
              createdAt: ele.createdAt,
              members: [],
              language: ele.language,
              keywords: ele.keywords,
              tags: ele.tags,
              allMemberUserIds: ele.allMemberUserIds,
              totalVisits: ele.totalVisits,
            }
            returnList.push(addObj);

            // returnList.push({
            //   _id: ele._id.toString(),
            //   groupRoomId: ele._id.toString(),
            //   creatorUserId: ele.creatorUserId,
            //   groupName: ele.groupName,
            //   description: ele.description,
            //   createdAt: ele.createdAt,
            //   members: [],
            // });
          }
        };

        this.activeGroups = returnList;
        
        // console.log('this.activeGroups in on get-group-list', this.activeGroups)
        // console.log('this.activeSocketsObj in on get-group-list', this.activeSocketsObj)
        socket.emit('update-group-list', {
            groups: this.activeGroups,
            // gruops: returnList,
          });
      });


    });

  }








  public listen(callback: (port: number) => void): void {
    // this.httpServer.listen(this.DEFAULT_PORT, () => {
    //   callback(this.DEFAULT_PORT);
    // });

    const port = Number(process.env.PORT) || 4002;

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