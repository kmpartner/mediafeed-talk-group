const fetch = require('node-fetch');

const { parseJwt } = require('../../util/auth');

const adNetworkDataUrl = process.env.ADNETWORK_DATA_URL;

const getTest = async (req, res, next) => {
  try {
    // console.log('req.headers', req.headers);
    const result = await fetch(adNetworkDataUrl + '/example', {
      headers: req.headers,
    })

    const resData = await result.json();
    // console.log(resData, result.status);

    res.status(result.status).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const getNearAdElements = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const location = req.query.userLocation ? req.query.userLocation : '';
    const language = req.query.selectLanguage || req.headers["accept-language"].split(",")[0];
    const adType = req.query.adType;

    const result = await fetch(adNetworkDataUrl + `/ad-filter-element/near-ad-elements?userLocation=${location}&selectLanguage=${language}&adType=${adType}`, {
      headers: req.headers,
    });

    const resData = await result.json();
    // console.log(resData, result.status);

    res.status(result.status).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const storeAdDisplay = async (req, res, next) => {
  try {
    const location = req.query.userLocation ? req.query.userLocation : '';
    const language = req.query.selectLanguage || req.headers["accept-language"].split(",")[0];

    let postBody = req.body;

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    const parsedToken = parseJwt(token);

    if (parsedToken && parsedToken.userId) {
      postBody = {
        ...req.body,
        visitUserId: parsedToken.userId,
      }
    }

    const result = await fetch(adNetworkDataUrl + `/ad-display/store-ad-display?userLocation=${location}&selectLanguage=${language}`, {
      method: 'POST',
      headers: req.headers,
      // body: JSON.stringify(req.body),
      body: JSON.stringify(postBody),
    });

    const resData = await result.json();
    // console.log(resData, result.status);

    res.status(result.status).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const storeClickVisit = async (req, res, next) => {
  try {
    const location = req.query.userLocation ? req.query.userLocation : '';
    const language = req.query.selectLanguage || req.headers["accept-language"].split(",")[0];

    let postBody = req.body;

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    const parsedToken = parseJwt(token);

    if (parsedToken && parsedToken.userId) {
      postBody = {
        ...req.body,
        visitUserId: parsedToken.userId,
      }
    }

    const result = await fetch(adNetworkDataUrl + `/ad-visit/store-click-visit?userLocation=${location}&selectLanguage=${language}`, {
      method: 'POST',
      headers: req.headers,
      // body: JSON.stringify(req.body),
      body: JSON.stringify(postBody),
    });

    const resData = await result.json();
    // console.log(resData, result.status);

    res.status(result.status).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const storeAdVideoViewVisit = async (req, res, next) => {
  try {
    // console.log('storeAdVideoViewVisit');

    const location = req.query.userLocation ? req.query.userLocation : '';
    const language = req.query.selectLanguage || req.headers["accept-language"].split(",")[0];

    let postBody = req.body;

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    const parsedToken = parseJwt(token);

    if (parsedToken && parsedToken.userId) {
      postBody = {
        ...req.body,
        visitUserId: parsedToken.userId,
      }
    }


    const result = await fetch(adNetworkDataUrl + `/ad-visit/store-ad-video-view-visit?userLocation=${location}&selectLanguage=${language}`, {
      method: 'POST',
      headers: req.headers,
      // body: JSON.stringify(req.body),
      body: JSON.stringify(postBody),
    });

    const resData = await result.json();
    // console.log(resData, result.status);

    res.status(result.status).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getTest,
  getNearAdElements,
  storeAdDisplay,
  storeClickVisit,
  storeAdVideoViewVisit,
}