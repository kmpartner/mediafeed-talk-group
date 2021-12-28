const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');

const { clearImage } = require('../../util/file');
const { s3DeleteOne } = require('../../util/image');

require('dotenv').config();


const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
  secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
  region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();


module.exports = {
  createUser: async function ({ userInput }, req) {
    // const email = args.userInput.email
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-mail is invalid.' });
    }
    if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    // const token = jwt.sign(
    //   {
    //     userId: user._id.toString(),
    //     email: user.email
    //   },
    //   process.env.JWT_KEY,
    //   { expiresIn: '1d' }
    // );
    const nowSecond = Math.floor(Date.now() / 1000)
    // const expire = nowSecond + (60 * 60 * 24*365)  // 1year later
    const expire = nowSecond + parseInt(process.env.JWT_EXPIRE_TIME) // 10years later
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString(),
      exp: expire,
      iat: nowSecond,
    },
      process.env.JWT_KEY,
      // { expiresIn: '1d' }
    );
    // console.log(user, token, expire, nowSecond);
    // console.log('now date', new Date(nowSecond * 1000).toISOString());
    // console.log('req.headers', req.headers);
    user.lastLoginDate = new Date(nowSecond * 1000).toISOString();
    user.lastLoginAgent = req.headers['user-agent'];
    user.acceptLanguage = req.headers['accept-language'];
    await user.save();

    return {
      token: token,
      userId: user._id.toString(),
      name: user.name,
      exp: expire,
      iat: nowSecond,
    };
  },

  user: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      const error = new Error('user not found');
      error.code = 404;
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

    return {
      ...user._doc,
      _id: user._id.toString(),
      // userId: user.userId,
      imageUrl: doUrl,
      imagePath: user.imageUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  },

  getUserWithImagePath: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found');
      error.code = 404;
      throw error;
    }

    return {
      ...user._doc,
      _id: user._id.toString(),
      imagePath: user.imageUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  },

  updateStatus: async function ({ status, geolocation }, req) {
    // console.log(req.body)
    // console.log(status, geolocation);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found');
      error.code = 404;
      throw error;
    }
    user.status = status;
    user.geolocation = geolocation;
    await user.save();
    // console.log('user', user);
    return {
      ...user._doc,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  updateUserName: async function ({ name, locationData }, req) {
    // console.log(req.body)
    // console.log('locationData', locationData);
    // console.log('name', name);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error('user not found');
      error.code = 404;
      throw error;
    }
    user.name = name;
    user.geolocation = locationData;
    await user.save();
    // console.log('user', user);

    const userPosts = await Post
      // .find({ creatorId: req.userId })
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorName: name }
        });
    // console.log('userPosts', userPosts);

    const userComments = await Comment
      // .find({ creatorId: req.userId })
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorName: name }
        });
    // console.log('userComments', userComments);

    return {
      ...user._doc,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  createUserImage: async function ({ imageUrl, locationData }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }
    // const imageUrl = imageUrl;
    // console.log('user', user, 'imageUrl', imageUrl);

    user.imageUrl = imageUrl;
    user.imagePath = imageUrl;
    user.geolocation = locationData;
    console.log('locationData', locationData);
    await user.save();

    const userPosts = await Post
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorImageUrl: imageUrl }
        });
    // console.log('userPosts', userPosts);

    const userComments = await Comment
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorImageUrl: imageUrl }
        });
    // console.log('userComments', userComments);

    return {
      ...user._doc,
      _id: user._id.toString(),
      imageUrl: imageUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  deleteUserImage: async function ({ imageUrl, locationData }, req) {
    console.log('imageUrl', imageUrl);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error('Could not find user.');
      error.code = 404;
      throw error;
    }


    const deleteParams = {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: imageUrl
    };
    await s3DeleteOne(deleteParams);
    clearImage(imageUrl);

    user.imageUrl = null;
    user.imagePath = null;
    user.geolocation = locationData;
    // console.log('locationData', locationData);
    await user.save();

    const userPosts = await Post
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorImageUrl: null }
        });
    // console.log('userPosts', userPosts);
    const userComments = await Comment
      .updateMany(
        { creatorId: req.userId },
        {
          "$set": { creatorImageUrl: null }
        });
    // console.log('userComments', userComments);


    return true;
    
  },

  getUsers: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }

    const users = await User.find();
    if (!users) {
      const error = new Error('No users found');
      error.code = 404;
      throw error;
    }


    return users.map(p => {
      return {
        // ...p._doc,
        _id: p._id.toString(),
        userId: p.userId,
        name: p.name,
        // email: p.email,
        // fbUserId: p.fbUserId,
        // imageUrl: p.imageUrl,
        imageUrl: p.imageUrl 
        ? s3.getSignedUrl('getObject', {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Key: p.imageUrl ? p.imageUrl : 'dummy-key',
            Expires: 60 * 60
          }) 
        : null,
        createdAt: p.createdAt ? p.createdAt.toISOString() : null

      }
    })


    return {
      usersData: users.map(p => {
        return {
          // ...p._doc,
          _id: p._id.toString(),
          name: p.name,
          // email: p.email,
          imageUrl: p.imageUrl ? p.imageUrl : null,
          createdAt: p.createdAt,

        }
      })
    }

    // return { 
    //   ...user._doc,
    //   _id: user._id.toString(),
    //   createdAt: user.createdAt.toISOString(),
    //   updatedAt: user.updatedAt.toISOString(),
    // }
  },

  updateEmailVerified: async function ({ fbUserId, emailVerified }, req) {
    // console.log(req.body)
    // console.log('locationData', locationData);
    // console.log('name', name);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found');
      error.code = 404;
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

    // user.name = name;
    // user.geolocation = locationData;
    // await user.save();
    // console.log('user', user);

    // const userPosts = await Post
    //   // .find({ creatorId: req.userId })
    //   .updateMany(
    //     { creatorId: req.userId },
    //     {
    //       "$set": { creatorName: name }
    //     });
    // // console.log('userPosts', userPosts);

    // const userComments = await Comment
    //   // .find({ creatorId: req.userId })
    //   .updateMany(
    //     { creatorId: req.userId },
    //     {
    //       "$set": { creatorName: name }
    //     });
    // // console.log('userComments', userComments);

    return {
      ...user._doc,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },


  postReset: async function ({ email }, req) {
    const getResetToken = () => {
      return new Promise((resolve, reject) => {

        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
            console.log(err);
            const error = new Error('Error Occured in rondomBytes generation.');
            error.statusCode = 500;
            throw error;
          }
          const token = buffer.toString('hex');

          User.findOne({ email: email })
            .then(user => {
              if (!user) {
                const error = new Error('Could not find email user.');
                error.statusCode = 404;
                throw error;
              }
              user.resetToken = token;
              user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
              return user.save()
                .then(result => {
                  // console.log(result);

                  return resolve(token);
                })
            })
            .catch(err => {
              console.log(err);
              return reject({ message: "token genration failed" });
            })

        })
      })
    }

    return { resetToken: await getResetToken() }
  },

  getResetPasswordTokenUser: async function ({ email }, req) {
    // const token = req.params.token;
    // const email = email;
    const user = await User.findOne({
      email: email,
      // resetToken: token, 
      resetTokenExpiration: { $gt: Date.now() }
    });
    if (!user) {
      const error = new Error('Could not find user with not expired restToken.');
      error.statusCode = 404;
      throw error;
    }
    // console.log(user, typeof (user.resetTokenExpiration));

    return user;
  },

  postNewPassword: async function ({ email, password, passwordToken }, req) {
    const storeNewPassword = () => {
      return new Promise((resolve, reject) => {
        let resetUser;
        let hashedPassword;

        User.findOne({
          resetToken: passwordToken,
          resetTokenExpiration: { $gt: Date.now() },
          // _id: userId
          email: email
        })
          .then(user => {
            console.log(user);
            if (!user) {
              const error = new Error('Could not find user.');
              error.statusCode = 404;
              throw error;
            }
            resetUser = user;

            return bcrypt.hash(password, 12)
          })
          .then(hashed => {
            console.log(hashed);
            hashedPassword = hashed;

            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;

            return resetUser.save()
          })
          .then(savedUser => {
            console.log(savedUser);
            return resolve(true);
          })
          .catch(err => {
            console.log(err);
            return reject(false);
          })

      });
    }

    return await storeNewPassword();

  },

  updateUserInfo: async function ({ 
    userId, email, name, locationData, firebaseUserDataInput, fierbaseAdditionalUserInfoInput 
  }, req) {
    // const locationData = JSON.parse(req.body.geolocation);

    // console.log('req.body updateUserInfo', req.body);
    // console.log('req.body.firebaseUserDataInput', req.body.firebaseUserDataInput);
    // console.log('firebaseUserDataInput', firebaseUserDataInput);
    // console.log('fierbaseAdditionalUserInfoInput', fierbaseAdditionalUserInfoInput)

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    // const user = await User.findById(req.userId);
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
            user: firebaseUserDataInput,
            additionalUserInfo: fierbaseAdditionalUserInfoInput
          }
      });
      await user.save();

    } else {
      //// update authsso userId user when login
      user.lastLoginDate = new Date().toISOString();
      user.lastLoginAgent = req.headers['user-agent'];
      user.acceptLanguage = req.headers['accept-language'];
      user.geolocation = locationData;
      user.firebaseData.user = firebaseUserDataInput;
      user.firebaseData.additionalUserInfo = fierbaseAdditionalUserInfoInput;
      await user.save();
    }


    return {
      ...user._doc,
      // _id: user._id.toString(),
      _id: user.userId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

  },

}