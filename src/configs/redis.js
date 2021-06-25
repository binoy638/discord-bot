const redis = require("redis");
const REDIS_URL = process.env.REDIS_URL;
const redisCache = redis.createClient(REDIS_URL);

redisCache.on("error", function (err) {
  console.log("Error " + err);
});

redisCache.on("ready", () => {
  console.log("Redis is ready");
});

redisCache.on("end", () => {
  console.log("Redis terminated");
});

module.exports = redisCache;

/*
 Cache Key Prefixs:
 Rd: Reddit posts 


*/
