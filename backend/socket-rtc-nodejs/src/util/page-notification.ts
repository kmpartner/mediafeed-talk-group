const fetch = require('node-fetch');

const { getUserNameData } = require('./get-user-name-data-util');

require('dotenv').config();

export const addPageNotificationData = async (textData: any, textId: any) => {
  try {

    let modifyContent = textData.text;
    if (textData.text.length > 100) {
      modifyContent = textData.text.slice(0,100) + '.....'
    } 

    const userNameData = await getUserNameData(textData, textData.fromUserId);

    const result = await fetch(process.env.UDRESTAPI_URL + 
      `/page-notification/add-page-notification-data-for-talk-group`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + textData.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        storeUserId: textData.toUserId,
        page: 'talk',
        // title: `new text from user ${textData.fromName}`,
        title: `new text from user ${userNameData?.name}`,
        message: modifyContent,
        dataForNotification: {
          fromUserId: textData.fromUserId,
          toUserId: textData.toUserId,
          // fromName: textData.fromName,
          sendAt: textData.sendAt,
          textId: textId,
          filePaths: textData.filePaths,
        },
      }),
    });

    const resData = await result.json();
    console.log(resData);
    return resData;

  } catch(err) {
    console.log(err);
    // throw err;
  }
}


