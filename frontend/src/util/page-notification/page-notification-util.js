export const getPageNotification = async (url, token) => {
  try {
    const result = await fetch(url + '/page-notification/', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    const resData = await result.json();

    console.log(result, resData);

    if (!result.ok) {
      throw new Error('error occured');
    }

    return resData;
  } catch(err) {
    console.log(err);
    throw err;
  }
};


export const updatePageNotificationLastOpenTime = async (url, token) => {
  try {
    const result = await fetch(url + '/page-notification/update-last-open-time', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    const resData = await result.json();

    console.log(result, resData);

    if (!result.ok) {
      throw new Error('error occured');
    }

    return resData;
  } catch(err) {
    console.log(err);
    throw err;
  }
};
