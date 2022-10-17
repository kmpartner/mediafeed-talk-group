const User = require('../../models/user/user');
const TalkPermission = require('../../models/user/talk-permission');

const getUserTalkPermission = async (req, res, next) => {
  try {

    const userId = req.userId;
    // const user = await User.findOne({ userId: userId });

    // if (!user) {
    //     const error = new Error('user not found.');
    //     error.statusCode = 404;
    //     throw error;
    // }

    let talkPermission = await TalkPermission.findOne({ userId: userId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: userId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await talkPermission.save();
    }

    res.status(200).json({ message: 'get user talkPermission success', data: talkPermission });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const addAcceptUserId = async (req, res, next) => {
  try {
    console.log('req.body');
    const userId = req.userId;
    const acceptUserId = req.body.acceptUserId;
    // const user = await User.findOne({ userId: userId });

    if (userId === acceptUserId) {
      const error = new Error('acceptUserId and userId should be different.');
      error.statusCode = 400;
      throw error;
    }

    const acceptUser = await User.findOne({ userId: acceptUserId });

    if (!acceptUserId || !acceptUser) {
        const error = new Error('acceptUserId or acceptUser not found.');
        error.statusCode = 400;
        throw error;
    }

    let talkPermission = await TalkPermission.findOne({ userId: userId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: userId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [], 
      })

      await talkPermission.save();
    }


    let acceptTalkPermission = await TalkPermission.findOne({ userId: acceptUserId })

    if (!acceptTalkPermission) {
      acceptTalkPermission = new TalkPermission({
        userId: acceptUserId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [], 
      })

      await acceptTalkPermission.save();
    }

    const nowTime = Date.now();

    const acceptUserIds = talkPermission.talkAcceptUserIds;
    
    const isInAcceptList = acceptUserIds.find(element => {
      return element.userId === acceptUserId;
    });

    if (!isInAcceptList) {
      const addedList = acceptUserIds.concat([{
        userId: acceptUserId,
        time: nowTime,
      }]);
  
      talkPermission.talkAcceptUserIds = addedList;
      await talkPermission.save();
    }


    const acceptedUserIds = acceptTalkPermission.talkAcceptedUserIds;

    const isInAcceptedList = acceptedUserIds.find(element => {
      return element.userId === userId;
    });

    if (!isInAcceptedList) {
      const addAcceptedList = acceptedUserIds.concat([{
        userId: userId,
        time: nowTime,
      }]);

      acceptTalkPermission.talkAcceptedUserIds = addAcceptedList;
      await acceptTalkPermission.save();
    }



    //// delete from request
    const requestedUserIds = talkPermission.talkRequestedUserIds;
    // const requestingUserIds = talkPermission.talkRequestingUserIds;

    const deletedList = requestedUserIds.filter(element => {
      return element.userId !== acceptUserId;
    });

    // const deletedList2 = requestingUserIds.filter(element => {
    //   return element.userId !== acceptUserId;
    // });

    talkPermission.talkRequestedUserIds = deletedList;
    // talkPermission.talkRequestingUserIds = deletedList2;
    await talkPermission.save();



    const acceptRequestingUserIds = acceptTalkPermission.talkRequestingUserIds;
    // const acceptRequestedUserIds = acceptTalkPermission.talkRequestedUserIds;

    const deletedAcceptList = acceptRequestingUserIds.filter(element => {
      return element.userId !== userId;
    });

    // const deletedAcceptList2 = acceptRequestedUserIds.filter(element => {
    //   return element.userId !== userId;
    // });

    acceptTalkPermission.talkRequestingUserIds = deletedAcceptList;
    // acceptTalkPermission.talkRequestedUserIds = deletedAcceptList2;
    await acceptTalkPermission.save();




    res.status(200).json({ message: 'add acceptUserId success', data: talkPermission });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};

const deleteAcceptUserId = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const userId = req.userId;
    const deleteUserId = req.query.deleteUserId;
    // const user = await User.findOne({ userId: userId });

    if (!deleteUserId) {
        const error = new Error('deleteUserId not found.');
        error.statusCode = 400;
        throw error;
    }

    let talkPermission = await TalkPermission.findOne({ userId: userId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: userId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      });

      await talkPermission.save();
    }


    let deleteTalkPermission = await TalkPermission.findOne({ userId: deleteUserId })

    if (!deleteTalkPermission) {
      deleteTalkPermission = new TalkPermission({
        userId: deleteUserId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [], 
      });

      await deleteTalkPermission.save();
    }


    // const acceptUserIds = talkPermission.talkAcceptUserIds;
    
    const deletedList = talkPermission.talkAcceptUserIds.filter(element => {
      return element.userId !== deleteUserId;
    });

    // console.log('deletedList', deletedList);

    talkPermission.talkAcceptUserIds = deletedList;
    await talkPermission.save();



    const deletedDeleteList = deleteTalkPermission.talkAcceptedUserIds.filter(element => {
      return element.userId !== userId;
    });

    deleteTalkPermission.talkAcceptedUserIds = deletedDeleteList;
    await deleteTalkPermission.save();


    res.status(200).json({ message: 'delete userId from accept list success', data: talkPermission });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};

const addRequestingUserId = async (req, res, next) => {
  try {

    const userId = req.userId;
    const destUserId = req.body.destUserId;
    // const user = await User.findOne({ userId: userId });

    if (userId === destUserId) {
      const error = new Error('destUserId and userId should be different.');
      error.statusCode = 400;
      throw error;
    }

    const destUser = await User.findOne({ userId: destUserId });

    if (!destUserId || !destUser) {
        const error = new Error('destUserId or destUser not found.');
        error.statusCode = 400;
        throw error;
    }

    let talkPermission = await TalkPermission.findOne({ userId: userId })
    let destTalkPermission = await TalkPermission.findOne({ userId: destUserId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: userId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await talkPermission.save();
    }

    if (!destTalkPermission) {
      destTalkPermission = new TalkPermission({
        userId: destUserId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await destTalkPermission.save();
    }


    //// check already accepted
    // const acceptUserIds = talkPermission.talkAcceptUserIds;

    // const isInAccept = acceptUserIds.find(element => {
    //   return element.userId === destUserId;
    // });

    const destAcceptUserIds = destTalkPermission.talkAcceptUserIds;

    const isAccepted = destAcceptUserIds.find(element => {
      return element.userId === userId;
    });

    if (isAccepted) {
      const error = new Error('already accept or accepted.');
      error.statusCode = 400;
      throw error;
    }


    const nowTime = Date.now();

    //// add in user requesting ids
    const requestingUserIds = talkPermission.talkRequestingUserIds;
    
    const isInRequestingList = requestingUserIds.find(element => {
      return element.userId === destUserId;
    });

    if (!isInRequestingList) {
      // const error = new Error('already exist in requestingUserIds.');
      // error.statusCode = 400;
      // throw error;

      const addedList = requestingUserIds.concat([{
        userId: destUserId,
        time: nowTime,
      }]);
  
      talkPermission.talkRequestingUserIds = addedList;
      await talkPermission.save();
    }




    //// add in destination user requested ids
    const destRequestedUserIds = destTalkPermission.talkRequestedUserIds;

    const isInDestRequestedList = destRequestedUserIds.find(element => {
      return element.userId === userId;
    });

    if (!isInDestRequestedList) {
      // const error = new Error('already exist in requestedUserIds.');
      // error.statusCode = 400;
      // throw error;

      const addedDestList = destRequestedUserIds.concat([{
        userId: userId,
        time: nowTime,
      }]);
  
      destTalkPermission.talkRequestedUserIds = addedDestList;
      await destTalkPermission.save();

    }

    res.status(200).json({ message: 'add requestingUserId success', data: talkPermission });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const deleteRequestingUserId = async (req, res, next) => {
  try {

    const userId = req.userId;
    const destUserId = req.query.destUserId;
    // const user = await User.findOne({ userId: userId });

    const destUser = await User.findOne({ userId: destUserId });

    if (!destUserId || !destUser) {
        const error = new Error('destUserId or destUser not found.');
        error.statusCode = 400;
        throw error;
    }

    let talkPermission = await TalkPermission.findOne({ userId: userId })
    let destTalkPermission = await TalkPermission.findOne({ userId: destUserId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: userId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await talkPermission.save();
    }

    if (!destTalkPermission) {
      destTalkPermission = new TalkPermission({
        userId: destUserId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await destTalkPermission.save();
    }

    // const nowTime = Date.now();


    //// delete from user requesting ids
    const requestingUserIds = talkPermission.talkRequestingUserIds;
    
    const deletedList = requestingUserIds.filter(element => {
      return element.userId !== destUserId;
    })

    talkPermission.talkRequestingUserIds = deletedList;
    await talkPermission.save();



    //// delete from destination user requested ids
    const destRequestedUserIds = destTalkPermission.talkRequestedUserIds;

    const deletedDestList = destRequestedUserIds.filter(element => {
      return element.userId !== userId;
    });

    destTalkPermission.talkRequestedUserIds = deletedDestList;
    await destTalkPermission.save();


    res.status(200).json({ message: 'delete requestingUserId success', data: talkPermission });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const checkUserAccept = async (req, res, next) => {
  try {

    const toUserId = req.query.toUserId;
    const fromUserId = req.userId;

    // const user = await User.findOne({ userId: userId });

    // if (!user) {
    //     const error = new Error('user not found.');
    //     error.statusCode = 404;
    //     throw error;
    // }

    let talkPermission = await TalkPermission.findOne({ userId: toUserId })

    if (!talkPermission) {
      talkPermission = new TalkPermission({
        userId: toUserId,
        talkRequestedUserIds: [],
        talkRequestingUserIds: [],
        talkAcceptUserIds: [], 
        talkAcceptedUserIds: [],
      })

      await talkPermission.save();
    }

    let returnData = false;

    const isInAcceptUserId = talkPermission.talkAcceptUserIds.find(element => {
      return element.userId === fromUserId;
    });

    if (isInAcceptUserId) {
      returnData = true;
    };
    

    res.status(200).json({ message: 'check accepte userId result', data: returnData });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};

module.exports = {
  getUserTalkPermission,
  addAcceptUserId,
  deleteAcceptUserId,
  addRequestingUserId,
  deleteRequestingUserId,
  checkUserAccept,
}