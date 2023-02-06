
 export const getUserAccessPermission = async (url, token, userId) => {
    try {
      const result = await fetch(url + '/talk-permission/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
      });
  
      const resData = await result.json();

      console.log(result, resData);
      // dispatch('SET_TALKPERMISSION', resData.data);

      if (!result.ok) {
        throw new Error('error occured');
      }

      return resData;
    } catch(err) {
      console.log(err);
      throw err;
    }
  };

export const addAcceptUserId = async (url, token, acceptUserId, isQRToken) => {
  try {

    let requestUrl = url + '/talk-permission/accept';
    
    if (isQRToken) {
      requestUrl = url + '/talk-permission/accept-qr';
    }

    const result = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        acceptUserId: acceptUserId,
      }),
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

export const deleteAcceptUserId = async (url, token, deleteUserId) => {
  try {
    const result = await fetch(url + `/talk-permission/accept?deleteUserId=${deleteUserId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   acceptUserId: acceptUserId,
      // }),
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


export const addRequestingUserId = async (url, token, destUserId) => {
  try {
    const result = await fetch(url + `/talk-permission/request`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        destUserId: destUserId,
      }),
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


export const deleteRequestingUserId = async (url, token, destUserId) => {
  try {
    const result = await fetch(url + `/talk-permission/request?destUserId=${destUserId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   destUserId: destUserId,
      // }),
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