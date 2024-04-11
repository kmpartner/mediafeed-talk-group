const fetch = require('node-fetch');

import { GroupTextInfo } from '../server';
// import { getUserNameData } from './get-user-name-data-util';
import { pushTextToUsers2 } from './push-notification';

require('dotenv').config();

export const addPageNotificationData = async (
  textData: GroupTextInfo, 
  idsForPush: string[],
  fromUserNameData: any,
) => {
  try {

    let modifyContent = textData.text;
    if (textData.text.length > 100) {
      modifyContent = textData.text.slice(0,100) + '.....'
    } 

    // const userNameData = await getUserNameData(textData, textData.fromUserId);

    for (const uid of idsForPush) {

      const result = await fetch(process.env.UDRESTAPI_URL + 
        `/page-notification/add-page-notification-data-for-talk-group`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + textData.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storeUserId: uid,
          page: 'group',
          title: `new text from user ${fromUserNameData?.name}`,
          message: modifyContent,
          dataForNotification: {
            fromUserId: textData.fromUserId,
            groupRoomId: textData.groupRoomId,
            groupName: textData.groupName,
            sendAt: textData.sendAt,
            
            textId: textData.textId,
            filePaths: textData.filePaths,
            fromName: fromUserNameData?.name,
          },
        }),
      });
  
      const resData = await result.json();
      console.log(resData);
      // return resData;
    }

    pushTextToUsers2(
      '', 
      idsForPush,
      textData,
      textData.groupRoomId,
      fromUserNameData,
    );


  } catch(err) {
    console.log(err);
    // throw err;
  }
}


