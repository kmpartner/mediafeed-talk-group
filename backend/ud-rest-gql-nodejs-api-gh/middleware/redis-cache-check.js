
const { createClient } = require('redis');

require('dotenv').config();

const createRedisKeyName = (originalUrl, qParams) => {
  if (!originalUrl) {
    return ''
  }

  if (qParams && qParams.type && qParams.type === 'Like') {
    return originalUrl.split('?')[0] + '?type=Like'; 
  }

  return originalUrl.split('?')[0];
};


module.exports = async (req, res, next) => {
    // try {

      // console.log(req.query);
      // const redisClient = await connectRedis();
      // const redisClient = redis;

      const redisHost = process.env.REDIS_HOST;
      const redisClient = createClient({
          url: `redis://@${redisHost}:6379`
      });

      redisClient.on("error", function(error) {
        console.error(error);
        redisClient.quit();
        
        next();
        // throw new Error('redis error occured')
      });

      redisClient.on("connect", async function(connect) {
        // console.log('connect', connect);
        const redisKey = createRedisKeyName(req.originalUrl, req.query);
  
        console.log(req.originalUrl, redisKey);
        redisClient.get(redisKey, function(err, cachedData) {

          if (err) {
            console.log(err);
            next();
            // throw new Error('redis get error occured')
          }

          // console.log('cachedData', cachedData);
          if (cachedData) {
            const parsedCachedData = JSON.parse(cachedData);
            req.redisCachedData = parsedCachedData;
          }
    
          if (!cachedData && redisKey) {
            req.redisKey = redisKey;
          }

          redisClient.quit();

          next();
        });
    

      });
      // if (redisClient) {
      //   const redisKey = createRedisKeyName(req.originalUrl, req.query);
  
      //   console.log(req.originalUrl, redisKey);
      //   const cachedData =  await redisClient.get(redisKey);
  
      //   await redisClient.disconnect();
  
      //   // const cachedData =  await redisClient.get('abc');
      //   // console.log('cachedData', cachedData);
      //   if (cachedData) {
      //     const parsedCachedData = JSON.parse(cachedData);
          
      //     req.redisCachedData = parsedCachedData;
      //   }
  
      //   if (!cachedData && redisKey) {
      //     req.redisKey = redisKey;
      //   }
      // }

      // next();

    // } catch (err) {
    //   console.log(err);
    //   next();
    // }
}