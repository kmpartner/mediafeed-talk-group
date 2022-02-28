export const storeClickData = (url, token, adElementId, adPlaceId, type,) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/ad-visit/store-click-visit`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adElementId: adElementId,
        adPlaceId: adPlaceId,
        type: type,
        // linkUrl: linkUrl,
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

export const getNearAdElements = (url, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url + `/ad-filter-element/near-ad-elements?userLocation=${localStorage.getItem('userLocation')}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const resData = await response.json();
        resolve(resData);
      } else {
        reject({ message: 'get ads failed' });
      }
    } 
    catch (err) {
      console.log(err);
      reject(err);
    }

    // fetch(url + `/ad-filter-element/near-ad-elements?userLocation=${localStorage.getItem('userLocation')}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     'Content-Type': 'application/json'
    //   },
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error("Can't get ads data");
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     console.log(resData);
  
    //     resolve({ message: 'get ads data success', data: resData });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     // resolve({ message: 'emailVerified fbUserId update failed', error: err });
    //     reject({ message: 'get ads data failed', error: err });
    //   });
  });
};