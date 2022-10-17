const { pushTextToUsers2 } = require('./util/push-notification');

exports.handlePushNotification = (socket: any) => {

  socket.on('group-text-send-result-recieved', async (data: any) => {
    console.log('group-text-send-recieved, data', data);

    try {
      const textData = data.textData;
      
      if (!textData) {
        throw new Error('textData not found');
      }

      const pushResult = await pushTextToUsers2(
        textData.fromUserId, 
        data.idsForPush, 
        textData,
        textData.groupRoomId
      );
      
      // console.log('pushResult', pushResult);
      socket.emit('group-push-result', {
        message: 'group push notify success',
        pushResult: pushResult
      });

    }
    catch(err: any) {
      console.log(err);

      socket.emit('group-push-result', {
        message: 'group push notify failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
};