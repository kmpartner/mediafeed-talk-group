// const { createClient } = require('redis');

// // let redisClient;

// const redisHost = process.env.REDIS_HOST;
    
// const redis = createClient({
//     url: `redis://@${redisHost}:6379`
// });

// // redis.on('error', err => console.log('Redis Client Error', err));


// const redisClientConnect = async () => {
//   try {
//     // const redisHost = process.env.REDIS_HOST;
    
//     // const client = createClient({
//     //     url: `redis://@${redisHost}:6379`
//     // });
    
//     // // client.on('error', err => { 
//     // //   console.log('Redis Client Error', err);
//     // // });

//     // // client.on("connect", function(connect) {
//     // //   console.log('connect', connect);
//     // // });
    
//     // await client.connect();
    
//     // return client;

//   } catch(err) {
//     console.log(err);
//     // throw err;
//   }
// }

// // redisClientConnect();

// module.exports = {
//   // redisClient: redisClient,
//   connectRedis: redisClientConnect,
//   // redisClient: redisClient,
//   redis: redis,
// }