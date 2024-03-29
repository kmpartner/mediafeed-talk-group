"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http_1 = require("http");
const bodyParser = require('body-parser');
const socketRedis = require('socket.io-redis');
const Redis = require('ioredis');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fetch = require('node-fetch');
const TextTalk = require('./models/text-talk');
const GroupTalk = require('./models/group-talk');
const TalkConnection = require('./models/talk-connection');
// const TestRoutes = require('./routes/test');
const TextTalkRoutes = require('./routes/text-talk');
const fileUploadRoutes = require('./routes/file-upload');
const { fileUpload } = require('./middleware/multer');
const { handlePushNotification } = require('./handle-push');
const { createReturnPost } = require('./util/file-upload-utils');
require('dotenv').config();
class Server {
    constructor() {
        this.activeSockets = [];
        this.activeSocketsObj = [];
        this.activeGroups = [];
        this.userObj = {};
        this.textList = [];
        this.DEFAULT_PORT = 4001;
        this.initialize();
    }
    initialize() {
        this.app = express();
        this.httpServer = http_1.createServer(this.app);
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
    configureApp() {
        // this.app.use(express.static(path.join(__dirname, "../public")));
    }
    configureRoutes() {
        this.app.get("/healthz", (req, res) => {
            // res.sendFile("index.html");
            res.send("hello world express socket.io healthz");
        });
        this.app.use((req, res, next) => {
            //// for push
            var allowedOrigins = [
                'https://ud-gqlapi-front.web.app',
                'https://ud-gqlapi-front.firebaseapp.com',
                'https://ud-restapi-front.web.app',
                'https://ud-restapi-front.firebaseapp.com',
                'https://www.watakura.xyz',
                'https://watakura.xyz',
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
        });
        console.log('talk-files path', path.join('', 'talk-files'));
        // this.app.use('/talk-files', express.static(path.join(__dirname, 'talk-files')));
        this.app.use('/talk-files', express.static(path.join('', 'talk-files')));
        // this.app.use('/test', TestRoutes);
        this.app.use('/text-talk', TextTalkRoutes);
        this.app.use('/file-upload', fileUploadRoutes);
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
        this.app.use((error, req, res, next) => {
            console.log(error);
            const status = error.statusCode || 500;
            const message = error.message;
            const data = error.data;
            res.status(status).json({ message: message, data: data });
        });
    }
    handleSocketConnection() {
        // // match both front and backend
        const initialLoadNum = 25;
        // const initialLoadNum = 6;
        //// initially check auth 
        let jwtUserId;
        this.io.use(function (socket, next) {
            // console.log(socket.handshake);
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, function (err, decoded) {
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
        });
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
            this.io.clients((err, clients) => {
                console.log('clients in connection', clients); // an array containing socket //// (ids in 'room3')
                this.activeSockets = clients;
                this.io.emit("update-user-list", {
                    users: this.activeSockets
                });
            });
            socket.on("call-user", (data) => {
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
                };
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
                    return element.socketId === socket.id;
                });
                socket.to(data.to).emit("answer-made", {
                    socket: socket.id,
                    answer: data.answer,
                    destUser: destUser,
                });
            });
            socket.on('connection-made', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('connection-made data', data);
                const user = this.activeSocketsObj.find(element => {
                    return element.socketId === socket.id;
                });
                // console.log('user', user);
                let talkStartAt;
                const destUser = this.activeSocketsObj.find(element => {
                    return element.socketId === user.destUser.socketId;
                });
                if (destUser && destUser.destUser && destUser.destUser.socketId === user.socketId) {
                    talkStartAt = Date.now();
                }
                let socketConnection;
                socketConnection = yield TextTalk.findOne({
                    userId: user.userId,
                });
                if (!socketConnection) {
                    // socketConnection = await new TextTalk({ userId: user.userId });
                    socketConnection = yield new TextTalk({
                        userId: user.userId,
                        talk: {
                            pairId: `${user.userId}-${data.destUser.userId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield socketConnection.save();
                }
                const talkWithDest = yield TextTalk.findOne({
                    userId: user.userId,
                    'talk.pairId': `${user.userId}-${data.destUser.userId}`
                });
                if (!talkWithDest) {
                    socketConnection.talk.push({
                        pairId: `${user.userId}-${data.destUser.userId}`,
                        text: []
                    });
                    yield socketConnection.save();
                }
                let destConnection;
                destConnection = yield TextTalk.findOne({
                    userId: data.destUser.userId,
                });
                if (!destConnection) {
                    destConnection = yield new TextTalk({
                        userId: data.destUser.userId,
                        talk: {
                            pairId: `${data.destUser.userId}-${user.userId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield destConnection.save();
                }
                const talkWithUser = yield TextTalk.findOne({
                    userId: data.destUser.userId,
                    'talk.pairId': `${data.destUser.userId}-${user.userId}`
                });
                if (!talkWithUser) {
                    destConnection.talk.push({
                        pairId: `${data.destUser.userId}-${user.userId}`,
                        text: []
                    });
                    yield destConnection.save();
                }
                const findConnection = yield socketConnection.connection.find((element) => {
                    // console.log(element);
                    return element.socketId === socket.id;
                });
                console.log('findConnection', findConnection);
                findConnection.callTo.push({
                    socketId: data.destUser.socketId,
                    userId: data.destUser.userId,
                    userName: data.destUser.userName,
                    connectAt: data.destUser.connectAt,
                    talkStartAt: talkStartAt && talkStartAt,
                    createAt: Date.now(),
                });
                yield socketConnection.save();
                //// get taxt-talk data
                let textTalkOne;
                textTalkOne = yield TextTalk.findOne({
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
                const userDestTalk = talkWithDest.talk.find((talk) => {
                    return talk.pairId === `${user.userId}-${data.destUser.userId}`;
                });
                // console.log('talkWithDest.talk', talkWithDest.talk);
                // console.log('userDestTalk', userDestTalk);
                // console.log('textTalkOne.talk[0].text', textTalkOne.talk[0].text)
                socket.emit('update-text-list', {
                    // textList: textTalkOne.talk[0].text,
                    textList: userDestTalk.text,
                });
                // console.log('talkWithDest.talk', talkWithDest.talk);
                const room1 = `${user.userId}-room`;
                const room2 = `${data.destUser.userId}-room`;
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
                };
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
            }));
            socket.on("reject-call", data => {
                console.log('reject-call data', data);
                socket.to(data.from).emit("call-rejected", {
                    socket: socket.id,
                    user: data.user
                });
            });
            socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                console.log('disconnect socket.id', socket.id);
                const user = this.activeSocketsObj.find(element => {
                    return element.socketId === socket.id;
                });
                console.log('user in disconnect', user);
                this.io.clients((err, clients) => __awaiter(this, void 0, void 0, function* () {
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
                }));
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
            }));
            // socket.on("user-removed", (data) => {
            //   console.log('user-removed', data);
            // })
            socket.on('hey', () => {
                console.log('hey received');
            });
            socket.on('user-info', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('user-info data', data);
                // this.userObj = data;
                let socketConnection;
                socketConnection = yield TextTalk.findOne({
                    userId: data.userId,
                });
                if (!socketConnection) {
                    socketConnection = yield new TextTalk({
                        userId: data.userId,
                    });
                    yield socketConnection.save();
                    // socketConnection.connection.push({
                    //   socketId: socket.id,
                    //   connectAt: data.connectAt
                    // });
                    // await socketConnection.save();
                    //// store connection info
                    const talkConnection = yield new TalkConnection({
                        userId: data.userId,
                        socketId: socket.id,
                        connectAt: data.connectAt,
                    });
                    yield talkConnection.save();
                }
                else {
                    const findSocket = yield TextTalk.findOne({
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
                        const talkConnection = yield new TalkConnection({
                            userId: data.userId,
                            socketId: socket.id,
                            connectAt: data.connectAt,
                            disconnectAt: 0
                        });
                        yield talkConnection.save();
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
                    });
                    socket.broadcast.emit('ask-usersObj', {
                        askUser: data,
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
                    });
                    socket.broadcast.emit('ask-usersObj', {
                        askUser: data,
                    });
                }
            }));
            socket.on('update-user-list-recieved', data => {
                console.log('update-user-list-recieved data', data);
                const recievedData = data;
                this.io.clients((err, clients) => {
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
                this.io.clients((err, clients) => {
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
                        return element.userId === data.newUser.userId;
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
                            });
                        }
                    }
                });
            });
            socket.on('ask-usersObj-recieved', data => {
                console.log('ask-usersObj-recieved data', data);
                this.io.clients((err, clients) => {
                    console.log('clients in ask-usersObj-recieved-recieved', clients); // an array containing socket ids
                    this.activeSockets = clients;
                    if (this.activeSocketsObj.length > 1) {
                        this.io.emit('update-usersObj-list', {
                            usersObj: this.activeSocketsObj,
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
            socket.on('text-send', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('text-send, data', data);
                // console.log('jwtUserId', jwtUserId);
                if (data.fromUserId !== jwtUserId) {
                    throw new Error('not authenticated');
                }
                const result = yield fetch(process.env.UDRESTAPI_URL +
                    `/talk-permission/check-user-accept?toUserId=${data.toUserId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + data.token,
                        'Content-Type': 'application/json'
                    },
                });
                const resData = yield result.json();
                console.log(resData);
                if (!resData.data) {
                    // throw new Error('user is not accepted');
                    socket.emit('error-user-accepted', {
                        message: 'user accepted error',
                    });
                    return;
                }
                console.log('user-accepted');
                // return;
                let socketConnection;
                socketConnection = yield TextTalk.findOne({
                    userId: data.fromUserId,
                });
                if (!socketConnection) {
                    socketConnection = yield new TextTalk({
                        userId: data.fromUserId,
                        talk: {
                            pairId: `${data.fromUserId}-${data.toUserId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield socketConnection.save();
                }
                ;
                const talkWithDest = yield TextTalk.findOne({
                    userId: data.fromUserId,
                    'talk.pairId': `${data.fromUserId}-${data.toUserId}`
                });
                if (!talkWithDest) {
                    socketConnection.talk.push({
                        pairId: `${data.fromUserId}-${data.toUserId}`,
                        text: []
                    });
                    yield socketConnection.save();
                }
                let destConnection;
                destConnection = yield TextTalk.findOne({
                    userId: data.toUserId,
                });
                if (!destConnection) {
                    destConnection = yield new TextTalk({
                        userId: data.toUserId,
                        talk: {
                            pairId: `${data.toUserId}-${data.fromUserId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield destConnection.save();
                }
                const talkWithUser = yield TextTalk.findOne({
                    userId: data.toUserId,
                    'talk.pairId': `${data.toUserId}-${data.fromUserId}`
                });
                if (!talkWithUser) {
                    destConnection.talk.push({
                        pairId: `${data.toUserId}-${data.fromUserId}`,
                        text: []
                    });
                    yield destConnection.save();
                }
                const userDestTalk = talkWithDest.talk.find((talk) => {
                    return talk.pairId === `${data.fromUserId}-${data.toUserId}`;
                });
                const destUserTalk = talkWithUser.talk.find((talk) => {
                    return talk.pairId === `${data.toUserId}-${data.fromUserId}`;
                });
                userDestTalk.text.push(data);
                destUserTalk.text.push(data);
                yield talkWithDest.save();
                yield talkWithUser.save();
                ////connect case
                if (data.to) {
                    const room1 = `${data.toUserId}-room`;
                    const room2 = `${data.fromUserId}-room`;
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
                    const urlUserDestTalk = userDestTalk.text.map((text) => {
                        return createReturnPost(text);
                    });
                    const getMoreNum = data.getMoreNum || 1;
                    // console.log(urlTextList);
                    //// update textdata of fromUser
                    socket.emit('update-text-list', {
                        // textList: userDestTalk.text,
                        textList: urlUserDestTalk.slice(-1 * (getMoreNum * initialLoadNum + 1)),
                        isMoreText: urlUserDestTalk.length > (getMoreNum * initialLoadNum + 1),
                        socketOnName: 'text-send',
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
                            // textList: userDestTalk.text,
                            // textList: urlUserDestTalk,
                            textList: urlUserDestTalk.slice(-1 * (getMoreNum * initialLoadNum + 1)),
                            isMoreText: urlUserDestTalk.length > (getMoreNum * initialLoadNum + 1),
                            socketOnName: 'text-send',
                        });
                        //// send textdata info to toUser
                        this.io.to(destUser.socketId).emit('text-from-noconnect-user', {
                            // text: userDestTalk.text[userDestTalk.text.length -1],
                            text: urlUserDestTalk[urlUserDestTalk.length - 1],
                        });
                        //// toUser in noconnect-talk and not noconnect-talk with user, start push notify user textdata
                        if (destUser.socketRooms) {
                            if (!destUser.socketRooms[room1] || !destUser.socketRooms[room2]) {
                                // console.log('destUser.socketRooms && !destUser.socketRooms[room1] || !destUser.socketRooms[room2]');
                                socket.emit('send-text-forPush', {
                                    // text: userDestTalk.text[userDestTalk.text.length -1]
                                    text: urlUserDestTalk[urlUserDestTalk.length - 1],
                                });
                            }
                        }
                        //// toUser online but not in rooms, start push notify textdata
                        if (!destUser.socketRooms) {
                            socket.emit('send-text-forPush', {
                                // text: userDestTalk.text[userDestTalk.text.length -1]
                                text: urlUserDestTalk[urlUserDestTalk.length - 1],
                            });
                        }
                    }
                    else {
                        socket.emit('send-text-forPush', {
                            // text: userDestTalk.text[userDestTalk.text.length -1]
                            text: urlUserDestTalk[urlUserDestTalk.length - 1],
                        });
                    }
                }
            }));
            socket.on('text-delete', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('text-delete, data', data);
                if (data.userId !== data.text.fromUserId) {
                    throw new Error('not authenticated');
                }
                let socketConnection;
                socketConnection = yield TextTalk.findOne({
                    userId: data.text.fromUserId,
                });
                if (!socketConnection) {
                    const error = new Error('user talk data not found');
                    // error.name = 'authError';
                    throw error;
                }
                ;
                const talkWithDest = yield TextTalk.findOne({
                    userId: data.text.fromUserId,
                    'talk.pairId': `${data.text.fromUserId}-${data.text.toUserId}`
                });
                if (!talkWithDest) {
                    const error = new Error('user talk data not found');
                    // error.name = 'authError';
                    throw error;
                }
                let destConnection;
                destConnection = yield TextTalk.findOne({
                    userId: data.text.toUserId,
                });
                if (!destConnection) {
                    const error = new Error('dest user talk data not found');
                    // error.name = 'authError';
                    throw error;
                }
                const talkWithUser = yield TextTalk.findOne({
                    userId: data.text.toUserId,
                    'talk.pairId': `${data.text.toUserId}-${data.text.fromUserId}`
                });
                if (!talkWithUser) {
                    const error = new Error('dest user talk data not found');
                    // error.name = 'authError';
                    throw error;
                }
                const userDestTalk = talkWithDest.talk.find((talk) => {
                    return talk.pairId === `${data.text.fromUserId}-${data.text.toUserId}`;
                });
                const destUserTalk = talkWithUser.talk.find((talk) => {
                    return talk.pairId === `${data.text.toUserId}-${data.text.fromUserId}`;
                });
                const userDestTalkElement = userDestTalk.text.find((talk) => {
                    return talk.sendAt === data.text.sendAt;
                });
                const destUserTalkElement = destUserTalk.text.find((talk) => {
                    return talk.sendAt === data.text.sendAt;
                });
                // console.log('destUserTalkElement', destUserTalkElement);
                if (userDestTalkElement) {
                    userDestTalk.text.pull({ _id: data.text._id });
                }
                if (destUserTalkElement) {
                    destUserTalk.text.pull({ _id: destUserTalkElement._id });
                }
                yield talkWithDest.save();
                yield talkWithUser.save();
                ////connect case
                if (data.text.to) {
                    const room1 = `${data.text.toUserId}-room`;
                    const room2 = `${data.text.fromUserId}-room`;
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
                    const urlUserDestTalk = userDestTalk.text.map((text) => {
                        return createReturnPost(text);
                    });
                    const getMoreNum = data.getMoreNum || 1;
                    //// update textdata of fromUser
                    socket.emit('update-text-list', {
                        // textList: userDestTalk.text,
                        // textList: urlUserDestTalk,
                        textList: urlUserDestTalk.slice(-1 * (getMoreNum * initialLoadNum - 1)),
                        isMoreText: urlUserDestTalk.length > (getMoreNum * initialLoadNum - 1),
                        socketOnName: 'text-delete',
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
                            // textList: userDestTalk.text,
                            // textList: urlUserDestTalk,
                            textList: urlUserDestTalk.slice(-1 * (getMoreNum * initialLoadNum - 1)),
                            isMoreText: urlUserDestTalk.length > (getMoreNum * initialLoadNum - 1),
                            socketOnName: 'text-delete',
                        });
                    }
                    else {
                        // socket.emit('send-text-forPush', {
                        //   text: userDestTalk.text[userDestTalk.text.length -1]
                        // });
                    }
                }
            }));
            socket.on('get-textTalks', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('get-textTalks data', data);
                const textTalks = yield TextTalk.find({ userId: data.user.userId });
                // console.log('textTalks', textTalks);
                if (textTalks) {
                    const textList = textTalks[0].talk;
                    socket.emit('textTalks-data', {
                        talkList: textList
                    });
                }
                else {
                    socket.emit('textTalks-data', {
                        talkList: []
                    });
                }
            }));
            socket.on('noconnect-get-userDestTalk', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('noconnect-get-userDestTalk data', data);
                const user = data.user;
                if (jwtUserId !== user.userId) {
                    throw new Error('not authenticated');
                }
                let socketConnection;
                socketConnection = yield TextTalk.findOne({
                    userId: user.userId,
                });
                if (!socketConnection) {
                    // socketConnection = await new TextTalk({ userId: user.userId });
                    socketConnection = yield new TextTalk({
                        userId: user.userId,
                        talk: {
                            pairId: `${user.userId}-${data.destUser.userId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield socketConnection.save();
                }
                const talkWithDest = yield TextTalk.findOne({
                    userId: user.userId,
                    'talk.pairId': `${user.userId}-${data.destUser.userId}`
                });
                if (!talkWithDest) {
                    socketConnection.talk.push({
                        pairId: `${user.userId}-${data.destUser.userId}`,
                        text: []
                    });
                    yield socketConnection.save();
                }
                let destConnection;
                destConnection = yield TextTalk.findOne({
                    userId: data.destUser.userId,
                });
                if (!destConnection) {
                    destConnection = yield new TextTalk({
                        userId: data.destUser.userId,
                        talk: {
                            pairId: `${data.destUser.userId}-${user.userId}`,
                            text: []
                        },
                        connection: [],
                    });
                    yield destConnection.save();
                }
                const talkWithUser = yield TextTalk.findOne({
                    userId: data.destUser.userId,
                    'talk.pairId': `${data.destUser.userId}-${user.userId}`
                });
                if (!talkWithUser) {
                    destConnection.talk.push({
                        pairId: `${data.destUser.userId}-${user.userId}`,
                        text: []
                    });
                    yield destConnection.save();
                }
                // const userDestTalk = talkWithDest.talk.find((talk: any) => {
                //   return talk.pairId === `${user.userId}-${data.destUser.userId}`
                // });
                const userDestTalk = socketConnection.talk.find((talk) => {
                    return talk.pairId === `${user.userId}-${data.destUser.userId}`;
                });
                //// leave from existing rooms except for own room, and join noconnect rooms
                for (const room in socket.rooms) {
                    if (socket.id !== room) {
                        socket.leave(room, () => {
                            // console.log('after leave socket.rooms', socket.rooms);        
                        });
                    }
                    ;
                }
                // console.log('this.activeSocketObj', this.activeSocketsObj);
                const room1 = `${user.userId}-${data.destUser.userId}-noconnect-room`;
                const room2 = `${data.destUser.userId}-${user.userId}-noconnect-room`;
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
                    };
                    const listWithoutUser = this.activeSocketsObj.filter(element => {
                        return element.userId !== user.userId;
                    });
                    this.activeSocketsObj = listWithoutUser.concat(userWithRooms);
                    // console.log('this.activeSocketsObj after room', this.activeSocketsObj)
                });
                const urlUserDestTalk = userDestTalk.text.map((text) => {
                    return createReturnPost(text);
                });
                const getMoreNum = data.getMoreNum || 1;
                socket.emit('update-text-list', {
                    // textList: textTalkOne.talk[0].text,
                    // textList: userDestTalk.text,
                    // textList: urlUserDestTalk,
                    textList: urlUserDestTalk.slice(-1 * getMoreNum * initialLoadNum),
                    isMoreText: urlUserDestTalk.length > getMoreNum * initialLoadNum,
                });
            }));
            socket.on('noconnect-get-more', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('noconnect-get-more data', data);
                const user = data.user;
                if (jwtUserId !== user.userId) {
                    throw new Error('not authenticated');
                }
                const talkWithDest = yield TextTalk.findOne({
                    userId: user.userId,
                    'talk.pairId': `${user.userId}-${data.destUser.userId}`
                });
                if (talkWithDest) {
                    const userDestTalk = talkWithDest.talk.find((talk) => {
                        return talk.pairId === `${user.userId}-${data.destUser.userId}`;
                    });
                    if (userDestTalk) {
                        const urlUserDestTalk = userDestTalk.text.map((text) => {
                            return createReturnPost(text);
                        });
                        const getMoreNum = data.getMoreNum || 1;
                        socket.emit('update-text-list', {
                            // textList: textTalkOne.talk[0].text,
                            // textList: userDestTalk.text,
                            // textList: urlUserDestTalk,
                            textList: urlUserDestTalk.slice(-1 * getMoreNum * initialLoadNum),
                            isMoreText: urlUserDestTalk.length > getMoreNum * initialLoadNum,
                            socketOnName: 'noconnect-get-more',
                        });
                    }
                }
            }));
            //// handle push notification for text send
            handlePushNotification(socket);
            socket.on('get-favorite-users', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('get-favorite-users data', data);
                try {
                    if (data.userId !== jwtUserId) {
                        const error = new Error('not authenticated');
                        error.name = 'authError';
                        throw error;
                    }
                    const textTalk = yield TextTalk.findOne({
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
                catch (err) {
                    console.log(err);
                    socket.emit('get-favorite-users-result', {
                        // action: 'delete-group-member',
                        message: 'Getting favorite users failed',
                        error: { message: err.message, name: err.name }
                    });
                }
            }));
            socket.on('edit-favorite-users', (data) => __awaiter(this, void 0, void 0, function* () {
                console.log('edit-favorite-users data', data);
                const newFavoriteTalkUsers = data.favoriteTalkUsers;
                try {
                    if (data.userId !== jwtUserId) {
                        const error = new Error('not authenticated');
                        error.name = 'authError';
                        throw error;
                    }
                    const textTalk = yield TextTalk.findOne({
                        userId: data.userId,
                    });
                    if (!textTalk) {
                        const error = new Error('Error, textTalk not found');
                        // error.name = 'authError';
                        throw error;
                    }
                    const uniqueList = _.uniqBy(newFavoriteTalkUsers, function (e) {
                        return e.userId;
                    });
                    if (uniqueList.length !== newFavoriteTalkUsers.length) {
                        const error = new Error('Error, something wrong, duplicate');
                        // error.name = 'authError';
                        throw error;
                    }
                    textTalk.favoriteTalkUsers = uniqueList;
                    yield textTalk.save();
                    socket.emit('edit-favorite-users-result', {
                        // action: 'delete-group-member',
                        message: 'Editing favorite users success',
                        favoriteTalkUsers: textTalk.favoriteTalkUsers,
                    });
                }
                catch (err) {
                    console.log(err);
                    socket.emit('edit-favorite-users-result', {
                        // action: 'delete-group-member',
                        message: 'Editing favorite users failed',
                        error: { message: err.message, name: err.name }
                    });
                }
            }));
        });
    }
    listen(callback) {
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
}
exports.Server = Server;
