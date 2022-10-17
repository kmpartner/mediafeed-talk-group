const fetch = require('node-fetch');

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
    const location = req.query.userLocation ? req.query.userLocation : '';
    const language = req.query.selectLanguage || req.headers["accept-language"].split(",")[0];

    const result = await fetch(adNetworkDataUrl + `/ad-filter-element/near-ad-elements?userLocation=${location}&selectLanguage=${language}`, {
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

    const result = await fetch(adNetworkDataUrl + `/ad-display/store-ad-display?userLocation=${location}&selectLanguage=${language}`, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body),
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

    const result = await fetch(adNetworkDataUrl + `/ad-visit/store-click-visit?userLocation=${location}&selectLanguage=${language}`, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body),
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
}