const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const probe = require('node-ffprobe')
const gm = require('gm');
var im = require('imagemagick');
var imageMagick = gm.subClass({ imageMagick: true });
var ObjectId = require('mongoose').Types.ObjectId;
const aws = require('aws-sdk');

const io = require('../../socket');
const Post = require('../../models/feed/post.js');
const User = require('../../models/user/user');
const Comment = require('../../models/feed/comment');
const PostVisit = require('../../models/feed/post-visit');
const FavoritePost = require('../../models/feed/favarite-post');
const imageModify = require('../../util/image');
const { s3Upload, s3DeleteOne, s3DeleteMany } = require('../../util/image');
const { testAuth } = require('../../util/auth');
const { clearImage} = require('../../util/file');
const { createReturnPost } = require('./feed');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();

const videoFilePath = 'images-video';

// exports.feedAction = async (req, res, next) => {
//     // console.log(req.body);
//     io.getIO().emit('posts', { action: 'action' });
//     res.json({ message: "response from getPosts controllers for socket" });
// }



exports.createVideoPost = async (req, res, next) => {
    // console.log('post-image req.files: ', req.files);
    console.log('req.body.oldPath', req.body.oldPath);
    console.log('req.body', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const b64Simage = req.body.b64Simage;
    const public = req.body.public;
    // const language = req.headers['accept-language'];
    const language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : '';
    const headers = req.headers;
    const location = JSON.parse(req.query.userLocation);
    const embedUrl = req.body.embedUrl;

    if (!req.files) {
        const error = new Error('files not found.');
        error.statusCode = 400;
        throw error;
    }

    if (req.files.length > 0 && embedUrl) {
        const error = new Error('embedUrl is not accepted when files exist');
        error.statusCode = 400;
        throw error;
    }

    // console.log('req.body, req.files', req.body, req.files);



    const savePost = async () => {



        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });
        
        // console.log('req.userId', req.userId);
        // create post in db
        // console.log('imageUrl in savePost', imageUrl, modifiedImageUrl, thumbnailImageUrl);
        const post = new Post({
            title: title,
            content: content,
            imageUrl: '',
            imageUrls: imageUrls,
            modifiedImageUrls: modifiedImageUrls,
            thumbnailImageUrls: thumbnailImageUrls,
            imagePaths: imageUrls,
            modifiedImagePaths: modifiedImageUrls,
            thumbnailImagePaths: thumbnailImageUrls,
            embedUrl: embedUrl,
            // creator: req.userId,
            // creatorId: req.userId,
            creatorId: req.userId,
            creator_id: user._id.toString(),
            creatorName: user.name,
            creatorImageUrl: user.imageUrl,
            b64Simage: b64Simage,
            public: public,
            language: language,
            geolocation: location,
            headers: headers
        });
        try {

            await post.save();
            // const user = await User.findById(req.userId);
            // user.posts.push(post);
            // await user.save()

            io.getIO().emit('posts', {
                action: 'create',
                post: { 
                    ...post._doc, 
                    // creator: { 
                    //     // _id: req.userId,
                    //     _id: user._id,
                    //     userId: req.userId,
                    //     name: user.name 
                    // } 
                }
            });

            const returnPost = createReturnPost(post);

            res.status(201).json({
                message: 'Post multi-images created Successfully',
                // post: post,
                post: returnPost,
                // creator: { 
                //     _id: user._id,
                //     userId: req.userId,
                //     name: user.name 
                // }
            })

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        };
    };



    const imageUrls = [];
    const modifiedImageUrls = [];
    const thumbnailImageUrls = [];

    for (const image of req.files) {
        imageUrls.push(image.path);

        let thumbnailImageUrl;

        const modifiedImageUrl = imageModify.makeModifiedUrl(image.path);
        modifiedImageUrls.push(modifiedImageUrl);
        
        const ForFile = image.path.split('/')[1];
        const ForFileArray = ForFile.split('.');
        const forFileFileType = ForFileArray.pop();
        const forFileWithoutFileType = ForFileArray.join('');
        const forFileFileName = forFileWithoutFileType + '.jpeg';
        // thumbnailImageUrl = 'images/' + forFileFileName;

        const fileMimetype = image.mimetype.split('/')[0];
        if (fileMimetype === 'image') {
            const smallImage = await createSmallImage(image.path, modifiedImageUrl);
        }
        if (fileMimetype === 'video') {
            thumbnailImageUrl = videoFilePath + '/' + forFileFileName
            thumbnailImageUrls.push(thumbnailImageUrl);





            //// resize video when more than 600 width
            var stats = fs.statSync(image.path);
            var fileSizeInBytes = stats.size;
            // Convert the file size to megabytes (optional)
            // var fileSizeInMegabytes = fileSizeInBytes / (10**6);
            console.log('fileSizeInbytes',fileSizeInBytes);

            const videoInfo = await getVideoInfo(image.path);
            console.log('videoInfo', videoInfo);
            // console.log('image', image);
            

            // resize video 
            if (!videoInfo.width || !videoInfo.height || 
                    videoInfo.width > 480 || videoInfo.height > 480
                ) {
                // await resizeVideo(image.path, modifiedImageUrl, 640);
                
                if (videoInfo.width > videoInfo.height) {
                    await resizeVideo(image.path, modifiedImageUrl, 480);
                } else {
                    await resizeVideo(image.path, modifiedImageUrl, 240);
                }

                var rsStats = fs.statSync(modifiedImageUrl);
                var rsfileSizeInBytes = rsStats.size;
                // Convert the file size to megabytes (optional)
                // var rfileSizeInMegabytes = rfileSizeInBytes / (10**6);
                console.log('rsfileSizeInbytes',rsfileSizeInBytes);
    
                if (rsfileSizeInBytes < fileSizeInBytes) {
                    console.log('in copyfile')
                    await copyFile(modifiedImageUrl, image.path);
                }
            }





            const trimedVideo = await trimVideo(image.path, modifiedImageUrl);
            const thumbnail = await createThumbnail(image.path, forFileFileName);
        }


        var params = {
            ACL: 'private',
            // ACL: 'public-read',
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Body: fs.createReadStream(image.path),
            //   ContentType: 'image/jpeg',
            // Key: `images/${req.file.originalname}`
            Key: `${image.path}`
        };

        var paramsModify = {
            ACL: 'private',
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Body: fs.createReadStream(modifiedImageUrl),
            //   ContentType: 'image/jpeg',
            Key: `${modifiedImageUrl}`
        };

        if (thumbnailImageUrl) {
            var paramsThumb = {
                ACL: 'private',
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Body: fs.createReadStream(thumbnailImageUrl),
                //   ContentType: 'image/jpeg',
                Key: `${thumbnailImageUrl}`
            };
        }

        if (fileMimetype === 'image') {
            if (!process.env.S3NOTUSE) {
                await s3Upload(params);
                await s3Upload(paramsModify);
                clearImage(image.path);
                clearImage(modifiedImageUrl);
                // savePost();
            }

        }
        if (fileMimetype === 'video') {
            if (!process.env.S3NOTUSE) {
                await s3Upload(params);
                await s3Upload(paramsModify);
                await s3Upload(paramsThumb);
                clearImage(image.path);
                clearImage(modifiedImageUrl);
                clearImage(thumbnailImageUrl);
                // savePost();
            }
        }

        //// send update data
        io.getIO().emit('posts', { 
            action: 'create-action',
            message: `image-upload-finish ${image.filename}`,
            imageData: image,
        });
    }


    io.getIO().emit('posts', { 
        action: 'upload-finish',
        message: `images-upload-finish`,
    });


    // const imageUrl = req.file.path;



    console.log(imageUrls);
    console.log(modifiedImageUrls);
    savePost();

};




exports.updateVideoPost = async (req, res, next) => {
    // console.log('req.body', req.body, 'req.files', req.files);

    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }
    // const user = await User.findById(req.userId);
    const post = await Post.findById(postId).populate('creator');

    if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
    }
    if (post.creatorId.toString() !== req.userId) {
        const error = new Error('not authorized!');
        error.statusCode = 403;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const b64Simage = req.body.b64Simage;
    const public = req.body.public;
    // const language = req.headers['accept-language'];
    const language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : '';
    // const geolocation = user.geolocation;
    const location = JSON.parse(req.query.userLocation);
    // console.log('LOCATION', location);
    const headers = req.headers;
    const embedUrl = req.body.embedUrl;
    // const imagePaths = req.body.imagePaths || [];

    let imageUrls = post.imageUrls || [];
    let modifiedImageUrls = post.modifiedImageUrls || [];
    let thumbnailImageUrls = post.thumbnailImageUrls || [];

    console.log('req.body, req.files', req.body, req.files);
    console.log('parseInt(req.body.totalFileNumber)', parseInt(req.body.totalFileNumber))
    // console.log(post.imageUrls);
    try {

        if (
            req.body.totalFileNumber 
            && parseInt(req.body.totalFileNumber) > 0
            && embedUrl
        ) {
            const error = new Error('embedUrl is not accepted when image exist');
            error.statusCode = 400;
            throw error;
        }

        if (req.files && req.files.length > 0) {
            const imageLimitNum = 6;

            if (req.body.totalFileNumber && parseInt(req.body.totalFileNumber) > imageLimitNum) {
                for (const image of req.files) {
                    clearImage(image.path);
                }

                const error = new Error('uploaded more than limit number');
                error.statusCode = 400;
                throw error;
            }


            for (const image of req.files) {
                imageUrls.push(image.path);

                let thumbnailImageUrl;
        
                const modifiedImageUrl = imageModify.makeModifiedUrl(image.path);
                modifiedImageUrls.push(modifiedImageUrl);
                
                const ForFile = image.path.split('/')[1];
                const ForFileArray = ForFile.split('.');
                const forFileFileType = ForFileArray.pop();
                const forFileWithoutFileType = ForFileArray.join('');
                const forFileFileName = forFileWithoutFileType + '.jpeg';
                // thumbnailImageUrl = 'images/' + forFileFileName;
        
                const fileMimetype = image.mimetype.split('/')[0];
                if (fileMimetype === 'image') {
                    const smallImage = await createSmallImage(image.path, modifiedImageUrl);
                }
                if (fileMimetype === 'video') {
                    thumbnailImageUrl = videoFilePath + '/' + forFileFileName
                    thumbnailImageUrls.push(thumbnailImageUrl);



                    //// resize video when more than 600 width
                    var stats = fs.statSync(image.path);
                    var fileSizeInBytes = stats.size;
                    // Convert the file size to megabytes (optional)
                    // var fileSizeInMegabytes = fileSizeInBytes / (10**6);
                    console.log('fileSizeInbytes',fileSizeInBytes);

                    const videoInfo = await getVideoInfo(image.path);
                    // console.log('videoInfo', videoInfo);
                    

                    // resize video 
                    // if (videoInfo.width > 480) {
                    if (!videoInfo.width || !videoInfo.height || 
                        videoInfo.width > 480 || videoInfo.height > 480
                    ) {
                        // await resizeVideo(image.path, modifiedImageUrl, 640);
                    
                        if (videoInfo.width > videoInfo.height) {
                            await resizeVideo(image.path, modifiedImageUrl, 480);
                        } else {
                            await resizeVideo(image.path, modifiedImageUrl, 240);
                        }

                        var rsStats = fs.statSync(modifiedImageUrl);
                        var rsfileSizeInBytes = rsStats.size;
                        // Convert the file size to megabytes (optional)
                        // var rfileSizeInMegabytes = rfileSizeInBytes / (10**6);
                        console.log('rsfileSizeInbytes',rsfileSizeInBytes);
            
                        if (rsfileSizeInBytes < fileSizeInBytes) {
                            console.log('in copyfile')
                            await copyFile(modifiedImageUrl, image.path);
                        }
                    }



                    const trimedVideo = await trimVideo(image.path, modifiedImageUrl);
                    const thumbnail = await createThumbnail(image.path, forFileFileName);
                }
        
        
                var params = {
                    ACL: 'private',
                    // ACL: 'public-read',
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Body: fs.createReadStream(image.path),
                    //   ContentType: 'image/jpeg',
                    // Key: `images/${req.file.originalname}`
                    Key: `${image.path}`
                };
        
                var paramsModify = {
                    ACL: 'private',
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Body: fs.createReadStream(modifiedImageUrl),
                    //   ContentType: 'image/jpeg',
                    Key: `${modifiedImageUrl}`
                };
        
                if (thumbnailImageUrl) {
                    var paramsThumb = {
                        ACL: 'private',
                        Bucket: process.env.DO_SPACE_BUCKET_NAME,
                        Body: fs.createReadStream(thumbnailImageUrl),
                        //   ContentType: 'image/jpeg',
                        Key: `${thumbnailImageUrl}`
                    };
                }

                if (fileMimetype === 'image') {
                    //// upload images to cloud storage if s3 use
                    if (!process.env.S3NOTUSE) {
                        await s3Upload(params);
                        await s3Upload(paramsModify);
                        clearImage(image.path);
                        clearImage(modifiedImageUrl);
                    }
                }
                if (fileMimetype === 'video') {
                    //// upload video to cloud storage if s3 use
                    if (!process.env.S3NOTUSE) {
                        await s3Upload(params);
                        await s3Upload(paramsModify);
                        await s3Upload(paramsThumb);
        
                        clearImage(image.path);
                        clearImage(modifiedImageUrl);
                        clearImage(thumbnailImageUrl);
                    }
                }    
                
                
                io.getIO().emit('posts', { 
                    action: 'update-action',
                    message: `image-upload-finish ${image.filename}`,
                    imageData: image,
                });
            }

            io.getIO().emit('posts', { 
                action: 'upload-finish',
                message: `images-upload-finish`,
            });

    }






    // try {
        // console.log('imageUrls', imageUrl, post.imageUrl);
        post.title = title;
        // post.imageUrl = imageUrl;
        // post.imagePath = imageUrl;
        post.imageUrls = imageUrls;
        post.imagePaths = imageUrls;
        post.content = content;
        post.b64Simage = b64Simage;
        post.public = public;
        post.language = language;
        post.geolocation = location;
        post.headers = headers;
        post.modifiedImageUrls = modifiedImageUrls;
        post.modifiedImagePaths = modifiedImageUrls;
        post.thumbnailImageUrls = thumbnailImageUrls;
        post.thumbnailImagePaths = thumbnailImageUrls;
        post.embedUrl = embedUrl;
        // const updateTime = Date.now();
        // post.lastUpdateTime = updateTime;
        // if (!post.updateTimes) {
        //     post.updateTimes = [];
        // }
        // post.updateTimes.push(updateTime);

        const result = await post.save();

        io.getIO().emit('posts', { action: 'update', post: result });
        
        const returnPost = createReturnPost(post);
        res.status(200).json({ 
            message: 'Post updated', 
            // post: result 
            post: returnPost,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};




exports.deleteVideoPost = async (req, res, next) => {
    const postId = req.params.postId;
    console.log('postId in deleteMutiImagePost', postId);

    // try {
    const post = await Post.findById(postId)

    // check login user
    if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
    }
    if (post.creatorId.toString() !== req.userId) {
        const error = new Error('not authorized!');
        error.statusCode = 403;
        throw error;
    }


    if (post.imageUrls.length > 0) {

        const imageObjects = [];
        const modifiedImageObjects = [];
        const thumbnailImageObjects = [];

        for (const imageUrl of post.imageUrls) { 
            const imageUrlArray = post.imageUrl.split('.');
            const fileType = imageUrlArray.pop().toLowerCase();

            imageObjects.push({
                Key: imageUrl,
            });
        }

        for (const imageUrl of post.modifiedImageUrls) { 
            const imageUrlArray = post.imageUrl.split('.');
            const fileType = imageUrlArray.pop().toLowerCase();

            modifiedImageObjects.push({
                Key: imageUrl,
            });
        }

        

        const params = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: imageObjects,
                // Quiet: false
            }
        };

        const modifiedParams = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: modifiedImageObjects,
                // Quiet: false
            }
        };


        //// delete images depend on store places
        if (!process.env.S3NOTUSE) {
            await s3DeleteMany(params);
            await s3DeleteMany(modifiedParams);
        }
        if (process.env.S3NOTUSE) {
            for (const imageUrl of post.imageUrls) {
                clearImage(imageUrl);
            }

            for (const modifiedImageUrl of post.modifiedImageUrls) {
                clearImage(modifiedImageUrl);
            }
        }

        if (post.thumbnailImageUrls.length > 0) {
            for (const imageUrl of post.thumbnailImageUrls) {
                thumbnailImageObjects.push({
                    Key: imageUrl,
                });
            }

            const thumbParam = {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Delete: {
                    Objects: thumbnailImageObjects,
                    // Quiet: false
                }
            };


            //// delete video images depend on store places
            if (!process.env.S3NOTUSE) {
                await s3DeleteMany(thumbParam);
            }
            if (process.env.S3NOTUSE) {
                for (const imageUrl of post.thumbnailImageUrls) {
                    clearImage(imageUrl);
                }
            }

        }

        


    }

    try {
        await Post.findByIdAndRemove(postId);

        await Comment.deleteMany({ postId: postId });
        await PostVisit.deleteOne({ postId: postId });

        ////delete favorite post
        await FavoritePost.deleteMany({ postId: postId });

        io.getIO().emit('posts', { action: 'delete', post: postId });

        res.status(200).json({ message: 'Deleted post.' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};



exports.deletePostVideo = async (req, res, next) => {
    const postId = req.params.postId;
    let deleteImageUrls = [];
    let deleteModifiedImageUrls = []; 
    let deleteThumbnailImageUrls = [];
    
    if (req.body.deleteImageUrls) {
        deleteImageUrls = req.body.deleteImageUrls.split(',');
    }
    if (req.body.deleteModifiedImageUrls) {
        deleteModifiedImageUrls = req.body.deleteModifiedImageUrls.split(',');
    }
    if (req.body.deleteThumbnailImageUrls) {
        deleteThumbnailImageUrls = req.body.deleteThumbnailImageUrls.split(',');
    }

    console.log('deleteImageUrls in deleteMutiImagePost', deleteImageUrls, deleteModifiedImageUrls, deleteThumbnailImageUrls);


    // try {
    const post = await Post.findById(postId)

    // check login user
    if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
    }
    if (post.creatorId.toString() !== req.userId) {
        const error = new Error('not authorized!');
        error.statusCode = 403;
        throw error;
    }

    if (!deleteImageUrls || deleteImageUrls.length === 0) {
        const error = new Error('deleteImageUrls not found');
        error.statusCode = 400;
        throw error;
    }
 


    const imageObjects = [];
    const modifiedImageObjects = [];
    const thumbnailImageObjects = [];

    for (const imageUrl of deleteImageUrls) { 
        imageObjects.push({
            Key: imageUrl,
        });
    }

    for (const imageUrl of deleteModifiedImageUrls) { 
        modifiedImageObjects.push({
            Key: imageUrl,
        });
    }

    

    const params = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Delete: {
            Objects: imageObjects,
            // Quiet: false
        }
    };

    const modifiedParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Delete: {
            Objects: modifiedImageObjects,
            // Quiet: false
        }
    };


    //// delete images depend on S3 (cloud storage) usage
    if (!process.env.S3NOTUSE) {
        await s3DeleteMany(params);
        await s3DeleteMany(modifiedParams);
    }

    if (process.env.S3NOTUSE) {
        for (const imageUrl of deleteImageUrls) { 
            clearImage(imageUrl);
        }
    
        for (const imageUrl of deleteModifiedImageUrls) { 
            clearImage(imageUrl);
        }
    }



    if (deleteThumbnailImageUrls.length > 0) {
        for (const imageUrl of post.thumbnailImageUrls) {
            thumbnailImageObjects.push({
                Key: imageUrl,
            });
        }

        const thumbParam = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: thumbnailImageObjects,
                // Quiet: false
            }
        };


        //// delete images depend on S3 (cloud storage) usage
        if (!process.env.S3NOTUSE) {
            await s3DeleteMany(thumbParam);
        }

        if (process.env.S3NOTUSE) {
            for (const imageUrl of post.thumbnailImageUrls) {
                clearImage(imageUrl);
            }
        }

    }



    try {

        const deletedImageUrls = post.imageUrls.filter(function(val) {
            return deleteImageUrls.indexOf(val) == -1;
        });
    
        const deletedModifiedImageUrls = post.modifiedImageUrls.filter(function(val) {
            return deleteModifiedImageUrls.indexOf(val) == -1;
        });
    
        const deletedThumbnailImageUrls = post.thumbnailImageUrls.filter(function(val) {
            return deleteThumbnailImageUrls.indexOf(val) == -1;
        });

        console.log('deletedImageUrls', deletedImageUrls, post.imageUrls);

        post.imageUrls = deletedImageUrls;
        post.modifiedImageUrls = deletedModifiedImageUrls;
        post.thumbnailImageUrls = deletedThumbnailImageUrls;

        post.imagePaths = deletedImageUrls;
        post.modifiedImagePaths = deletedModifiedImageUrls;
        post.thumbnailImagePaths = deletedThumbnailImageUrls;
        await post.save();

        // await Post.findByIdAndRemove(postId);

        // await Comment.deleteMany({ postId: postId });
        // await PostVisit.deleteOne({ postId: postId });

        // ////delete favorite post
        // await FavoritePost.deleteMany({ postId: postId });

        const returnPost = createReturnPost(post);
        
        io.getIO().emit('posts', { action: 'delete', post: postId });

        res.status(200).json({ 
            message: 'Deleted post images.',
            post: returnPost,
            // data: {
            //     post: post,
            //     deleteImagePaths: deleteImageUrls,
            // } 
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};




const createSmallImage = (imageUrl, modifiedImageUrl) => {
    return new Promise((resolve, reject) => {
        gm(imageUrl)
            // .resize(100, 100)
            // .resize(null, 100)
            .resize(null, 100)
            // .noProfile()
            .write(modifiedImageUrl, function (err) {
                if (err) {
                    console.log('error occured ', err);
                    reject({ message: "error occured " + err });
                }
                if (!err) {
                    console.log('done making small image')
                    resolve({ message: "done making small image" })
                    // console.log('done');
                    // gm(modifiedImageUrl)
                    //     .identify(function (err, data) {
                    //         if (err) console.log(err);
                    //         // if (!err) console.log('DATA:',data);

                    //     });
                }
            });
    })
}

const trimVideo = (imageUrl, modifiedImageUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg(imageUrl)
            .setFfmpegPath(ffmpeg_static)
            .setStartTime('00:00:03') //Can be in "HH:MM:SS" format also
            .setDuration(4)
            .size("400x?").autopad()
            .on("start", function (commandLine) {
                console.log("Spawned FFmpeg with command: " + commandLine);
            })
            .on('codecData', function (data) {
                console.log('Input is ' + data.audio_details + ' AUDIO ' +
                    'WITH ' + data.video_details + ' VIDEO');

            })
            .on("error", function (err) {
                console.log("error: ", err);
                reject({ message: "error occured " + err });
            })
            .on("end", function (err) {
                if (!err) {
                    console.log("video trim conversion Done");
                    resolve({ message: 'video trim conversion Done' })
                }
            })
            .saveToFile(modifiedImageUrl);

    })
}

const createThumbnail = (imageUrl, filename) => {
    return new Promise((resolve, reject) => {
        ffmpeg(imageUrl)
            // setup event handlers
            // .on('filenames', function(filename) {
            //     console.log('screenshots are ' + filenames.join(', '));
            // })
            .on('end', function () {
                console.log('screenshots were saved');
                resolve({ message: 'screenshots were saved' })
            })
            .on('error', function (err) {
                console.log('an error happened: ' + err.message);
                reject({ message: "error occured " + err });
            })
            // take 2 screenshots at predefined timemarks and size
            .takeScreenshots({
                count: 1,
                filename: filename,
                timemarks: ['50%'],
                size: '?x100'
            }, `./${videoFilePath}`);
    })
}


const getVideoInfo = (imageUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(imageUrl, (error, videoInfo) => {
            if (error) {
                console.log(error)
              return reject(error);
            }
            // console.log('videoInfo', videoInfo.streams[0]);
            resolve(videoInfo.streams[0]);
        })
    })
};

const copyFile = (path, distPath) => {
    return new Promise((resolve, reject) => {
        // File destination.txt will be created or overwritten by default.
        fs.copyFile(path, distPath, (err) => {
            if (err) {
                reject(err);
                // throw err;
            }
            console.log(`file was copied to ${distPath}`);
            resolve(`file was copied to ${distPath}`);
        });
    })
};


const resizeVideo = (imageUrl, modifiedImageUrl, width) => {
    return new Promise((resolve, reject) => {
        ffmpeg(imageUrl)
        .setFfmpegPath(ffmpeg_static)
        // .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
        // .setDuration(3)
        .size(`${width}x?`).autopad()
        .on("start", function (commandLine) {
            console.log("Spawned FFmpeg with command: " + commandLine);
        })
        .on('codecData', function (data) {
            console.log('Input is ' + data.audio_details + ' AUDIO ' +
                'WITH ' + data.video_details + ' VIDEO');
        })
        .on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on("error", function (err) {
            console.log("error: ", err);
            reject({ message: "error occured " + err });
        })
        .on("end", function (err) {
            if (!err) {
                console.log("video resize conversion Done");
                resolve({ message: 'video resize conversion Done' })
            }
        })
        .saveToFile(modifiedImageUrl);
        // .saveToFile('images/resize.mp4');
    });

};

    // var CreateSmallImage = gm(imageUrl)
    //     .resize(50, 50)
    //     // .noProfile()
    //     .write(modifiedImageUrl, function (err) {
    //         if (err) {console.log(err);}
    //         if (!err) {
    //             // console.log('done');
    //             // gm(modifiedImageUrl)
    //             //     .identify(function (err, data) {
    //                 //         if (err) console.log(err);
    //                 //         // if (!err) console.log('DATA:',data);

    //                 //     });
    //             }
    //     });

    // var trimVideo = ffmpeg(imageUrl)
    //     .setFfmpegPath(ffmpeg_static)
    //     .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
    //     .setDuration(3) 
    //     .size("50x?").autopad()
    //     .on("start", function(commandLine) {
    //         console.log("Spawned FFmpeg with command: " + commandLine);
    //     })
    //     .on('codecData', function(data) {
    //         console.log('Input is ' + data.audio_details + ' AUDIO ' +
    //         'WITH ' + data.video_details + ' VIDEO');
    //     })
    //     .on("error", function(err) {
    //         console.log("error: ", err);
    //     })
    //     .on("end", function(err) {
    //         if (!err) {
    //             console.log("conversion Done");
    //         }
    //     })
    //     .saveToFile(modifiedImageUrl);

        // gm(imageUrl)
        //     .size(function (err, size) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         if (!err) {
        //             console.log('size', size);
        //         console.log(size.width > size.height ? 'wider' : 'taller than you');
        //     }
        // });

        // im.identify(imageUrl, function(err, features){
    //     if (err) throw err;
    //     console.log('features', features);
    //   })

    // const imageUrlArray = imageUrl.split('.');
    // const fileType = imageUrlArray.pop();
    // const withoutFileType = imageUrlArray.join('');
    // const modifiedImageUrl = withoutFileType + '-modify.' + fileType 
    // console.log('imageUrl ft', fileType);
    // console.log('img',withoutFileType);
    // console.log('mod', modifiedImageUrl);