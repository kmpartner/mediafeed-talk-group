const fs = require('fs');
const path = require('path');

const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const mergeResolvers = require('./graphql/resolvers/index');
const mergeSchema = require('./graphql/types/index');
const auth = require('./middleware/auth');
const { clearImage } = require('./util/file');
const imageModify = require('./util/image');
const { 
    imageUpload, 
    userImageUpload, 
    gqlUserImageUpload, 
    groupImageUpload,
    imagesUpload,
} = require('./middleware/multer');
// const io = require('./socket.js')

require('dotenv').config()

const feedRoutes = require('./routes/feed/feed');
const authRoutes = require('./routes/user/auth');
const commentRoutes = require('./routes/feed/comment');
const followRoutes = require('./routes/feed/follow');
const imageForGqlRoutes = require('./routes/feed/image-for-gql');
const historyRoutes = require('./routes/history');
const pushSubscriptionRoute = require('./routes/push-notification/push-subscription');
const messagePushRoute = require('./routes/push-notification/message-push');
const commentPushRoute = require('./routes/push-notification/comment-push');
const talkPushRoute = require('./routes/push-notification/talk-push');
const groupPushRoute = require('./routes/push-notification/group-push');
const userReactionRoute = require('./routes/feed/user-reaction');
const groupImageRoute = require('./routes/group-image/group-image');
const feedMultiImageRoute = require('./routes/feed/feed-multi-images');

const db = require('./db');

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }

// });

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg' || 
//         file.mimetype === 'image/webp' ||
//         file.mimetype === 'video/mp4' ||
//         file.mimetype === 'video/webm' 
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

// const multerLimits = { fileSize: 1024 * 1024 * 3 };

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    {flags: 'a'}
);

app.use(helmet());
app.use(compression());
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }));
// app.use(morgan('combined',)); // combined common dev short tiny

app.use(bodyParser.json()); //application/json

app.use((req, res, next) => {

    var allowedOrigins = [
        'https://example.com',
        // 'http://localhost'
    ];

    var origin = req.headers.origin;
    console.log(origin);



    //// for push deploy
    // if (allowedOrigins.indexOf(origin) > -1){
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    // }

    //// for local dev
    res.setHeader('Access-Control-Allow-Origin', '*');



    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization' );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
    
})

// app.use(multer({ 
//     storage: fileStorage, 
//     limits: multerLimits, 
//     fileFilter: fileFilter}).single('image')
// );

// const imageUpload = multer({ 
//     storage: fileStorage, 
//     limits: multerLimits, 
//     fileFilter: fileFilter}).single('image')
// app.use(imageUpload);

// const imageUpload = imageUpload;

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images-user', express.static(path.join(__dirname, 'images-user')));

app.use('/feed', imageUpload, feedRoutes);
app.use('/auth', userImageUpload, authRoutes);
app.use('/comment', commentRoutes);
app.use('/follow', followRoutes);
app.use('/history', historyRoutes);
app.use('/push-subscription', pushSubscriptionRoute);
app.use('/message-push', messagePushRoute);
app.use('/comment-push', commentPushRoute);
app.use('/talk-push', talkPushRoute);
app.use('/group-push', groupPushRoute);
app.use('/user-reaction', userReactionRoute);
app.use('/group-image', groupImageUpload, groupImageRoute);
app.use('/feed-images', imagesUpload, feedMultiImageRoute);

app.use(auth);
app.use('', imageForGqlRoutes);
// app.use('/image-for-gql', imageForGqlRoutes);

// app.put('/post-image', imageUpload, (req, res, next) => {
//     // console.log('post-image req.body: ', req.body);
//     // console.log('post-image req.file: ', req.file);
//     // console.log('req.body.oldPath', req.body.oldPath);
//     if (!req.isAuth) {
//         throw new Error('Not authenticated');
//     }
//     if (!req.file) {
//         return res.status(200).json({ message: 'No file provided!' });
//     }
//     if (req.body.oldPath) {
//         // clearImage(req.body.oldPath);


//         if (req.body.oldPath === 'deleted' || req.body.oldPath === 'undefined') {
//             return res.status(201).json({ message: 'File Stored', filePath: req.file.path });
//         }


//         const modifiedImageUrl = imageModify.makeModifiedUrl(req.body.oldPath);
//         const forFileFileType = imageModify.makeFileTypeForThumbnail(req.body.oldPath);
//         const forFileFileName = imageModify.makeFileNameForThumbnail(req.body.oldPath);
//         // console.log('modifiedImageUrl', modifiedImageUrl);
//         // console.log('forfilefileType', forFileFileType);
//         // console.log('forFileFileName', forFileFileName);

//         let thumbnailImageUrl;
//         const fileMimetype = forFileFileType;
//         // console.log('forfilefiletype', forFileFileType)
//         if (
//           fileMimetype === 'jpg' ||
//           fileMimetype === 'jpeg' ||
//           fileMimetype === 'png' ||
//           fileMimetype === 'webp' 
//         ) {
//           console.log('in image minetype')
//             clearImage(req.body.oldPath);
//             clearImage(modifiedImageUrl);
//             // if(thumbnailImageUrl) {
//             //     clearImage(thumbnailImageUrl);
//             // }
//         }
//         if (
//           fileMimetype === 'mp4' ||
//           fileMimetype === 'webm'
//         ) {
//             thumbnailImageUrl = 'images/' + forFileFileName;
//             clearImage(req.body.oldPath);
//             clearImage(modifiedImageUrl);
//             clearImage(thumbnailImageUrl);
//         }

//     }
//     return res.status(201).json({ message: 'File Stored', filePath: req.file.path });
// });

// app.put('/user-image', gqlUserImageUpload, (req, res, next) => {
//     // console.log('user-image req.body: ', req.body);
//     // console.log('user-image req.file: ', req.file);
//     // console.log('req.body.oldPath', req.body.oldPath);
//     if (!req.isAuth) {
//         throw new Error('Not authenticated');
//     }
//     if (!req.file) {
//         return res.status(200).json({ message: 'No file provided!' });
//     }
//     if (req.body.oldPath) {
//         clearImage(req.body.oldPath);       
//     }

//     imageModify.createSmallUserImage(req.file.path);

//     return res.status(201).json({ message: 'File Stored', filePath: req.file.path });
// });


app.use(
    '/graphql', 
    graphqlHttp({
        // schema: graphqlSchema,
        schema: mergeSchema,
        // rootValue: graphqlResolver,
        rootValue: mergeResolvers,
        graphiql: true,
        formatError(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occured.';
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        }
}));


//// test /xxx
app.use('/xxx', (req, res, next) => {
    // console.log('in /xxx');
    res.send('<h1>Hello from Express r-g/xxx ...</h1>')
});
  
app.use('/healthz', (req, res, next) => {
    // console.log('in /healthz');
    res.send('<h3> /healthz . </h3>')
});


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
})

var key = fs.readFileSync(__dirname + '/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

// console.log('user', process.env.MONGO_USERNAME);
const dbName = process.env.MONGO_DB;
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9nwqj.mongodb.net/${dbName}?retryWrites=true&w=majority`
)
.then(result => {
    console.log(`Connected to mongoDB, ${dbName}, waiting initDb...`);
    // app.listen(8083);
    // httpServer.listen(process.env.HTTPSERVER_PORT, () => console.log("App http listening on port 8083!"));
    // httpsServer.listen(process.env.HTTPSSERVER_PORT, () => console.log("App https listening on port 8084!"));
    

    db.initDb((err, db) => {
        if (err) {
            console.log(err);
        } else {
            
        // const server = app.listen(8083);
        const port = process.env.PORT || 8083
        const server = app.listen(port, () => {
            console.log(`listening on ${port}... ud-rest-gql-node-api`);
            
            const io = require('./socket').init(server);
            io.on('connection', socket => {
                // console.log(socket.handshake);
                console.log('Client connected, origin: ', socket.handshake.headers.origin);
            })
    
        });


        }
    });


    // const server = app.listen(8083, () => {
    //     console.log('listening on port 8083... ud-rest-gql-node-api')
    // });

    // const io = require('./socket').init(server);
    // io.on('connection', socket => {
    //     // console.log(socket.handshake);
    //     console.log('Client connected, origin: ', socket.handshake.headers.origin);
    // })

    // const io = require('socket.io')(httpsServer);
    // io.on('connection', socket => {
    //     console.log('Client connected');
    // })

})
.catch(err => console.log(err));


// const express = require('express');
// const app = express();
const router = express.Router();
// const db = require('./db');
const sharks = require('./routes/sharks');

const sharkPath = __dirname + '/views/';
const port = process.env.PORT || 8084;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(sharkPath));
// app.use('/sharks', sharks);

// app.listen(port, function () {
//   console.log(`Example app listening on ${port}!`)
// })
