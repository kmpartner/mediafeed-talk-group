export const storeClickData = (url, token, adElementId, type, linkUrl) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/ad-visit/store-click-visit`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adElementId: adElementId,
        type: type,
        linkUrl: linkUrl,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't store click data");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ message: 'store click data success', data: resData });
      })
      .catch(err => {
        console.log(err);
        // resolve({ message: 'emailVerified fbUserId update failed', error: err });
        reject({ message: 'store click data failed', error: err });
      });
  });
};