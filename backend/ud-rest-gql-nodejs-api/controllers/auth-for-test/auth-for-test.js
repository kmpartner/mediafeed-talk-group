// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const { validationResult } = require("express-validator");
// const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");

const User = require("../../models/user/user");

exports.loginTokenForTest = async (req, res, next) => {
  //   console.log('in loginToken')
    console.log('req.body', req.body);

  const email = req.body.email;
  const userId = req.body.userId;
  // const password = req.body.password;
  // const firebaseData = req.body.firebaseData;
  // const fbProviderId = firebaseData.additionalUserInfo.providerId;

  const testUserIdList = ['61b41d950c71d544c5c32485', '60dfe34f948acf20fc03acde', '61b41d950c71d544c5c32496', '60e110d91892a4426830768c'];
  let loadedUser;
  try {
    const isUserIdInList = testUserIdList.find((id) => {
      return userId === id;
    });

    if (!isUserIdInList) {
      const error = new Error("invalid userId.");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ userId: userId });
    // console.log(user);
    if (!user) {
      const error = new Error("user with userId not found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    // console.log('user', user);
    // const isEqual = await bcrypt.compare(password, user.password);

    // if (!isEqual) {
    //     const error = new Error('Wrong password!');
    //     error.statusCode = 401;
    //     throw error;
    // }

    // console.log('expire', process.env.JWT_EXPIRE_TIME, typeof(process.env.JWT_EXPIRE_TIME))
    const firebaseData = loadedUser.firebaseData;

    const nowSecond = Math.floor(Date.now() / 1000);
    // const expire = nowSecond + (60 * 60 * 24*365)  // 1year later
    const expire = nowSecond + parseInt(process.env.JWT_EXPIRE_TIME);
    const token = jwt.sign(
      {
        email: loadedUser.email,
        // userId: loadedUser._id.toString(),
        userId: loadedUser.userId,
        // name: loadedUser.name,
        // firebaseUserData: firebaseData.user ? firebaseData.user : {},
        // fierbaseAdditionalUserInfo: firebaseData.additionalUserInfo ? firebaseData.additionalUserInfo : {},
          // firebaseProviderId: fbProviderId,
        exp: expire,
        iat: nowSecond,
      },
      process.env.JWT_KEY
      // { expiresIn: '1d' }
    );

    // console.log('now date', new Date(nowSecond * 1000).toISOString());
    // user.lastLoginDate = new Date(nowSecond * 1000).toISOString();
    // user.lastLoginAgent = req.headers['user-agent'];
    // user.acceptLanguage = req.headers['accept-language'];
    // user.firebaseData.user = firebaseData.user;
    // user.firebaseData.additionalUserInfo = firebaseData.additionalUserInfo;
    //   user.firebaseProviderId = firebaseData.additionalUserInfo.providerId;

    // await user.save();

    //   const loginInfo = new LoginInfo({
    //     userId: loadedUser._id.toString(),
    //     fromUrl: req.body.fromUrl,
    //     loginAgent: req.headers['user-agent'],
    //     acceptLanguage: req.headers['accept-language'],
    //   });
    //   await loginInfo.save();

    res.status(200).json({
      token: token,
      //   userId: loadedUser._id.toString(),
      //   name: loadedUser.name,
      // imageUrl: loadedUser.imageUrl,
      exp: expire,
      TGTexp: expire, ///// change or use exp only
      iat: nowSecond,

      // email: loadedUser.email,
      // userId: loadedUser._id.toString(),
      // name: email.split("@")[0],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
