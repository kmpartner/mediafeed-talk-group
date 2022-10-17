const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

require('dotenv').config()

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');
const { clearImage } = require('../../util/file');
const { createSmallUserImage, s3Upload, s3DeleteOne } = require('../../util/image');
 
const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    // console.log('errors',errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {

        const hashedPw = await bcrypt.hash(password, 12)

        const user = new User({
            email: email,
            password: hashedPw,
            name: name

        })
        const result = await user.save();

        res.status(201).json({ message: 'User created!', userId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {

        const user = await User.findOne({ email: email })
        // console.log(user);
        if (!user) {
            const error = new Error('A user with this email not found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        // console.log('user', user);
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        // console.log('expire', process.env.JWT_EXPIRE_TIME, typeof(process.env.JWT_EXPIRE_TIME))

        const nowSecond = Math.floor(Date.now() / 1000)
        // const expire = nowSecond + (60 * 60 * 24*365)  // 1year later
        const expire = nowSecond + parseInt(process.env.JWT_EXPIRE_TIME) // 10years later
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
            exp: expire,
            iat: nowSecond,
        },
            process.env.JWT_KEY,
            // { expiresIn: '1d' }
        );

        // console.log('now date', new Date(nowSecond * 1000).toISOString());
        user.lastLoginDate = new Date(nowSecond * 1000).toISOString();
        user.lastLoginAgent = req.headers['user-agent'];
        user.acceptLanguage = req.headers['accept-language'];
        await user.save();

        res.status(200).json({ 
            token: token, 
            userId: loadedUser._id.toString(), 
            name: loadedUser.name,
            imageUrl: loadedUser.imageUrl,
            exp: expire,
            iat: nowSecond
         });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserStatus = async (req, res, next) => {
    try {
        console.log('in getUserStatus');
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: user.status });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.updateUserStatus = async (req, res, next) => {
    // console.log('req.body', req.body);
    const newStatus = req.body.status;
    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        user.status = newStatus;
        user.geolocation = req.body.geolocation;
        await user.save();

        res.status(200).json({ message: 'User updated.' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUserName = async (req, res, next) => {
    // console.log('req.body', req.body);
    const errors = validationResult(req);
    // console.log('errors',errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const location = JSON.parse(req.query.userLocation);
    // console.log('Location', location);
    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        user.name = name;
        user.geolocation = location;
        await user.save();

        const userPosts = await Post
            .updateMany(
                {creatorId: req.userId}, 
                { "$set": { creatorName: name } 
            });
        // console.log('userPosts', userPosts);
        const userComments = await Comment
            .updateMany(
                {creatorId: req.userId},
                { "$set": { creatorName: name } 
            });

        res.status(200).json({ 
            message: 'User name updated.', 
            data: {
                user: {
                    name: name
                }
            }
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUserDescription = async (req, res, next) => {
    // console.log('req.body', req.body);
    const errors = validationResult(req);
    // console.log('errors',errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const description = req.body.description;
    const location = JSON.parse(req.query.userLocation);
    // console.log('Location', location);
    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        user.description = description;
        user.geolocation = location;
        await user.save();

        // const userPosts = await Post
        //     .updateMany(
        //         {creatorId: req.userId}, 
        //         { "$set": { creatorName: name } 
        //     });
        // // console.log('userPosts', userPosts);
        // const userComments = await Comment
        //     .updateMany(
        //         {creatorId: req.userId},
        //         { "$set": { creatorName: name } 
        //     });

        res.status(200).json({ 
            message: 'User description updated.', 
            data: {
                user: {
                    descripiton: description
                }
            }
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserDescription = async (req, res, next) => {
    const userId = req.query.userId

    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ 
            message: "get user description successfully.", 
            data: {
                user: {
                    description: user.description ? user.description : null
                }
            } 
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getUserData = async (req, res, next) => {

    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        // if (user._id.toString() !== req.userId) {
        if (user.userId !== req.userId) {
            const error = new Error('not authorized!');
            error.statusCode = 403;
            throw error;
        }

        let doUrl;
        if (user.imageUrl) {
            doUrl = s3.getSignedUrl('getObject',
                {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Key: `${user.imageUrl}`,
                    Expires: 60 * 60
                }
            );
        }

        // console.log(user);
        const port = process.env.PORT || 8083;

        let returnImageUrl = null;
        if (process.env.S3NOTUSE && user.imageUrl) {
            returnImageUrl = `http://localhost:${port}/${user.imageUrl}`;
        }
        if (!process.env.S3NOTUSE && user.imageUrl) {
            returnImageUrl = doUrl;
        }

        const returnUser = {
            ...user._doc,
            // imageUrl: doUrl,
            // imageUrl: process.env.S3NOTUSE ? user.imageUrl : doUrl,
            imageUrl: returnImageUrl,
        }

        res.status(200).json({ message: 'get user data successfully.', data: returnUser });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.updateEmailVerified = async (req, res, next) => {
    // console.log('req.body', req.body);
    // const name = req.body.name;
    const emailVerified = req.body.emailVerified;
    const fbUserId = req.body.fbUserId;

    // const location = JSON.parse(req.query.userLocation);
    // console.log('Location', location);

    try {
        const user = await User.findById(req.userId)

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        if (emailVerified !== user.firebaseData.emailVerified) {
            user.firebaseData.emailVerified = emailVerified;
            await user.save();
                // user.geolocation = location;
        }

        if (fbUserId !== user.firebaseData.fbUserId) {
            user.firebaseData.fbUserId = fbUserId;
            await user.save();
        }

        // console.log('after save or not save');
            
    

        // const userPosts = await Post
        //     .updateMany(
        //         {creatorId: req.userId}, 
        //         { "$set": { creatorName: name } 
        //     });
        // // console.log('userPosts', userPosts);
        // const userComments = await Comment
        //     .updateMany(
        //         {creatorId: req.userId},
        //         { "$set": { creatorName: name } 
        //     });

        res.status(200).json({ 
            message: 'user email verified fbUserId updated or unchanged.', 
            data: {
                user: {
                    emailVerified: emailVerified,
                    fbUserId: fbUserId
                }
            }
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.createUserImage = async (req, res, next) => {
    // console.log('req.body, req.file', req.body, req.file);
    // console.log('req.file.path', req.file.path, 'req.userId', req.userId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        res.status(422).json({ message: 'file is unacceptable file type or not exits'});
        // const error = new Error('No image provided');
        // error.statusCode = 422;
        // throw error;
    }

    // const imageCreator = await User.findById(req.userId);
    const imageCreator = await User.findOne({ userId: req.userId });
    const imageUrl = req.file.path;
    const location = JSON.parse(req.query.userLocation);
    // console.log('Location', location);

    if (!imageCreator) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }

    try {
            await createSmallUserImage(imageUrl);


            var params = {
                ACL: 'private',
                // ACL: 'public-read',
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Body: fs.createReadStream(imageUrl),
                //   ContentType: 'image/jpeg',
                // Key: `images/${req.file.originalname}`
                Key: `${imageUrl}`
            };

            //// store in cloud when s3 use and delete local
            if (!process.env.S3NOTUSE) {
                await s3Upload(params);
                clearImage(req.file.path);
                // fs.unlinkSync(req.file.path);
            }

            if (imageCreator.imageUrl) {
                const deleteParams = {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Key: imageCreator.imageUrl
                }

                //// delete old image depend on storage location
                if (!process.env.S3NOTUSE) {
                    await s3DeleteOne(deleteParams);
                    clearImage(imageCreator.imageUrl);
                }
                if (process.env.S3NOTUSE) {
                    clearImage(imageCreator.imageUrl);
                }

            }


            imageCreator.imageUrl = imageUrl;
            imageCreator.imagePath = imageUrl;
            imageCreator.geolocation = location;
            await imageCreator.save();

            const userPosts = await Post
                .updateMany(
                    {creatorId: req.userId}, 
                    { "$set": { creatorImageUrl: imageUrl } 
                });
                // console.log('userPosts', userPosts);
            const userComments = await Comment
                .updateMany(
                    {creatorId: req.userId},
                    { "$set": { creatorImageUrl: imageUrl } 
                });
                // console.log('userComments', userComments);

            res.status(200).json({ message: 'image updated', data: { imageUrl: imageUrl } });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.updateImage = async (req, res, next) => {
// }

exports.deleteUserImage = async (req, res, next) => {
    console.log('req.query', req.query);
    const location = JSON.parse(req.query.userLocation);
    // console.log('Location', location);

    try {
        // const user = await User.findById(req.userId);
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        // if (user._id.toString() !== req.userId) {
        //     const error = new Error('not authorized!');
        //     error.statusCode = 403;
        //     throw error;
        // }

        // clearImage(user.imageUrl);

        const deleteParams = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Key: user.imageUrl
        }


        //// delete image depend on storage location
        if (!process.env.S3NOTUSE) {
            await s3DeleteOne(deleteParams);
            clearImage(user.imageUrl);
        }
        if (process.env.S3NOTUSE) {
            clearImage(user.imageUrl);
        }

        
        user.imageUrl = null;
        user.imagePath = null;
        user.geolocation = location;
        await user.save();
        // io.getIO().emit('posts', { action: 'delete', post: postId });

        const userPosts = await Post
            .updateMany(
            {creatorId: req.userId}, 
            { "$set": { creatorImageUrl: null } 
            });
            // console.log('userPosts', userPosts);
        const userComments = await Comment
            .updateMany(
            {creatorId: req.userId},
            { "$set": { creatorImageUrl: null } 
            });
            // console.log('userComments', userComments);

        res.status(200).json({ message: 'Deleted image.' });


        // s3.deleteObject({
        //     Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //     Key: user.imageUrl
        // }, async function (err, data) {
        //     if (err) {
        //         console.log("There was an error deleting image: ", err.message);
        //         const error = new Error('There was an error deleting image');
        //         error.statusCode = 500;
        //         throw error;
        //     }
        //     console.log('Image Deleted ', data);

            
        //     user.imageUrl = null;
        //     user.imagePath = null;
        //     user.geolocation = location;
        //     await user.save();
        //     // io.getIO().emit('posts', { action: 'delete', post: postId });
    
        //     const userPosts = await Post
        //         .updateMany(
        //         {creatorId: req.userId}, 
        //         { "$set": { creatorImageUrl: null } 
        //         });
        //         // console.log('userPosts', userPosts);
        //     const userComments = await Comment
        //         .updateMany(
        //         {creatorId: req.userId},
        //         { "$set": { creatorImageUrl: null } 
        //         });
        //         // console.log('userComments', userComments);
    
        //     res.status(200).json({ message: 'Deleted image.' });

        // });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUsers = async (req, res, next) => {

    try {
        // const user = await User.findById(req.userId);

        // if (!user) {
        //     const error = new Error('Could not find user.');
        //     error.statusCode = 404;
        //     throw error;
        // }
        // if (user._id.toString() !== req.userId) {
        //     const error = new Error('not authorized!');
        //     error.statusCode = 403;
        //     throw error;
        // }

        const users = await User.find();
        if (!users) {
            const error = new Error('Could not find users.');
            error.statusCode = 404;
            throw error;
        }

        // console.log('users', users);

        const usersData = [];
        users.forEach(user => {
            usersData.push({
                _id: user._id.toString(),
                userId: user.userId,
                name: user.name,
                userColor: user.userColor,
                // description: user.description,
                // email: user.email,
                // imageUrl: user.imageUrl,
                // fbUserId: user.fbUserId,
                imageUrl: user.imageUrl 
                    ? s3.getSignedUrl('getObject', {
                        Bucket: process.env.DO_SPACE_BUCKET_NAME,
                        Key: user.imageUrl ? user.imageUrl : 'dummy-key',
                        Expires: 60 * 60 * 24 * 365
                      }) 
                    : null,
                createdAt: user.createdAt
            });
        });
        
        res.status(200).json({ message: 'get users data successfully.', data: usersData });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.getUsersForGroup = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) {
            const error = new Error('Could not find users.');
            error.statusCode = 404;
            throw error;
        }

        // console.log('users', users);

        const usersData = [];
        users.forEach(user => {
            usersData.push({
                _id: user._id.toString(),
                userId: user.userId,
                name: user.name,
                userColor: user.userColor,
                // description: user.description,
                // email: user.email,
                // imageUrl: user.imageUrl,
                // fbUserId: user.fbUserId,
                // imageUrl: user.imageUrl,
                imagePath: user.imagePath,
                createdAt: user.createdAt
            });
        });
        
        res.status(200).json({ message: 'get users data for group successfully.', data: usersData });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};



exports.getUserImageUrl = async (req, res, next) => {
    const userId = req.query.userId;

    try {
        const user = await User.findOne({ userId: userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        const returnData = {
            userId: user.userId,
            imageUrl: user.imageUrl 
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: user.imageUrl ? user.imageUrl : 'dummy-key',
                Expires: 60 * 60 * 24 * 30
              })
            : null,
        }

        res.status(200).json({ message: 'get user image url data successfully.', data: returnData });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};




exports.postReset = async (req, res, next) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
            const error = new Error('Error Occured in rondomBytes generation.');
            error.statusCode = 500;
            throw error;
        }
        const token = buffer.toString('hex');

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                const error = new Error('Could not find email user.');
                error.statusCode = 404;
                throw error;
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 1000*60*60;
            await user.save();
            console.log('user', user);    
        
            res.status(200).json({ message: 'token for password reset created', data: { resetToken: token }});
        }
        catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }

    });
}

exports.getResetPasswordTokenUser = async (req, res, next) => {
    // const token = req.params.token;
    const email = req.query.email;
    const user = await User.findOne({ 
        email: email,
        // resetToken: token, 
        resetTokenExpiration: { $gt: Date.now() }
    });
    
    if (!user) {
        return res.status(404).json({ message: 'Could not find user with not expired restToken.'})
        const error = new Error('Could not find user with not expired restToken.');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ message: 'user found', data: user });
};

exports.postNewPassword = async (req, res, next) => {
    const newPassword = req.body.password;
    // const userId = req.body.userId;
    const email = req.body.email;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    // console.log(req.body);

    try {
        const resetUser = await User.findOne({ 
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            // _id: userId
            email: email
         });

         if (!resetUser) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log('hashedPassowrd', hashedPassword);
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        await resetUser.save();

        res.status(200).json({ message: 'User password reset success' });

    } catch (err) {
    if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUserInfo = async (req, res, next) => {
    // console.log('req.body updateUserInfo', req.body)
    const locationData = JSON.parse(req.body.geolocation);
    try {
        let user = await User.findOne({ userId: req.userId });

        if (!user) {
            //// create user with authsso userId
            user = new User({
                userId: req.userId,
                email: req.body.email,
                name: req.body.name,
                lastLoginDate: new Date().toISOString(),
                lastLoginAgent: req.headers['user-agent'],
                acceptLanguage: req.headers['accept-language'],
                geolocation: locationData,
                firebaseData: {
                    user: req.body.firebaseUserData,
                    additionalUserInfo: req.body.fierbaseAdditionalUserInfo
                },
            });
            await user.save();
        } 
        else {
            //// update authsso userId user when login
            user.lastLoginDate = new Date().toISOString();
            user.lastLoginAgent = req.headers['user-agent'];
            user.acceptLanguage = req.headers['accept-language'];
            user.geolocation = locationData;
            user.firebaseData.user = req.body.firebaseUserData;
            user.firebaseData.additionalUserInfo = req.body.fierbaseAdditionalUserInfo;
            await user.save();
        }

        returnData = {
            // name: user.name
            user: user
        };
    
        res.status(200).json({ message: 'user info is updated', data: returnData });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateUserColor = async (req, res, next) => {
    // console.log('req.body updateUserInfo', req.body)
    const locationData = JSON.parse(req.body.geolocation);
    const userColor = req.body.userColor;
    
    try {
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            const error = new Error('user not found.');
            error.statusCode = 404;
            throw error;
        }

        user.userColor = userColor;
        user.geolocation = locationData;
        await user.save();

        const returnData = {
            userId: user.userId,
            userColor: user.userColor,
        }
    
        res.status(200).json({ message: 'user color is updated', data: returnData });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// exports.validateAuth = async (req, res, next) => {
//     // console.log('req.body validateAuth', req.body, req.userId);
//     try {
//         if (!req.userId || req.userId !== req.body.userId) {
//             const error = new Error('not authenticated.');
//             error.statusCode = 401;
//             throw error;
//         }

//         res.status(200).json({ message: 'auth validation success' });

//     } catch (err) {
//     if (!err.statusCode) {
//         err.statusCode = 500;
//     }
//     next(err);
// }
// }