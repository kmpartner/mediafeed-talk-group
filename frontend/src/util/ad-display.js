export const storeAdDisplay = async (url, token, adElementId, adPlaceId) => {
    try {
      const lsUserLocation = localStorage.getItem('userLocation') ? localStorage.getItem('userLocation') : '';
      const lsUserSelectLng = localStorage.getItem('userSelectLng') 
        ? localStorage.getItem('userSelectLng') 
        : navigator.language;
      
      // const response = await fetch(url + `/ad-display/store-ad-display?userLocation=${lsUserLocation}&selectLanguage=${lsUserSelectLng}`, {
      const response = await fetch(url + `/ad/ad-display?userLocation=${lsUserLocation}&selectLanguage=${lsUserSelectLng}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adElementId: adElementId,
          adPlaceId: adPlaceId,
        })
      });

      console.log(response);
      if (response.ok) {
        const resData = await response.json();
        console.log(resData);
        return resData;
        // resolve(resData);
      } else {
        // reject({ message: 'get ads failed' });
        throw new Error('something wrong')
      }
    } 
    catch (err) {
      console.log(err);
      // reject(err);
    }


};