import _ from 'lodash';

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
      const lsUserLocation = localStorage.getItem('userLocation') ? localStorage.getItem('userLocation') : '';
      const lsUserSelectLng = localStorage.getItem('userSelectLng') 
        ? localStorage.getItem('userSelectLng') 
        : navigator.language;
      
      const response = await fetch(url + `/ad-filter-element/near-ad-elements?userLocation=${lsUserLocation}&selectLanguage=${lsUserSelectLng}`, {
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

  });
};

export const createDisplayAd = (list) => {

  //// weight, other factors filter...
  const randomIndex = Math.floor(Math.random() * list.length);
  const randomValue = list[randomIndex];

  return randomValue;
};

export const createWithAdIndexList = () => {
  const zeroToFour = [];
  const fiveToNine = [];
  const tenToFourteen = [];
  const fifteenToNineteen = [];
  for (let i=0; i<20; i++) {
    // numArray.push(i);
    if (i>=1 && i < 5 ) {
      zeroToFour.push(i);
    }
    if (i >= 5 && i < 10) {
      fiveToNine.push(i);
    }
    if (i >= 10 && i < 15) {
      tenToFourteen.push(i);
    }
    if (i >= 15) {
      fifteenToNineteen.push(i);
    }
  }
  // console.log(numArray);

  // console.log('zeroToFour', zeroToFour, fiveToNine, tenToFourteen, fifteenToNineteen);
  const sample1 = _.sample(zeroToFour);
  const sample2 = _.sample(fiveToNine);
  const sample3 = _.sample(tenToFourteen);
  const sample4 = _.sample(fifteenToNineteen);

  const numArray = [sample1, sample2, sample3, sample4];
  // console.log('numArray', numArray);

  return numArray;
}

const testFunction = () => {
  console.log('test function called!!')
}
