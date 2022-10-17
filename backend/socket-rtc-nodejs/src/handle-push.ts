const { pushTextToUser2 } = require('./util/push-notification');

exports.handlePushNotification = (socket: any) => {

  socket.on('send-text-forPush-recieved', async (data: any) => {
    console.log('send-text-forPush-recieved, data', data);

    try {
      const textData = data.textData;
      
      if (!textData) {
        throw new Error('textData not found');
      }

      const pushResult = await pushTextToUser2(
        data.user.userId,
        data.textData,
      );
      
      // console.log('pushResult', pushResult);
      socket.emit('text-push-result', {
        message: 'text push notify success',
        pushResult: pushResult
      });

    }
    catch(err: any) {
      console.log(err);

      socket.emit('text-push-result', {
        message: 'text push notify failed',
        error: {
          message: err.messge
        }
      });
    }

  });
};