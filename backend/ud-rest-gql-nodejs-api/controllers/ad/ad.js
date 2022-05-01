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

const storeAdDisplay = async (req, res, next) => {

}

module.exports = {
  getTest,
  storeAdDisplay,
}