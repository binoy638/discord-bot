const { promisify } = require("util");
const { redisCache } = require("../configs/redis");

const getCacheAsync = promisify(redisCache.get).bind(redisCache);

const CacheSet = (key, value) => {
  if (typeof key !== "string") throw "Key must be a String";

  try {
    if (typeof value === "object") {
      redisCache.set(key, JSON.stringify(value));
    } else redisCache.set(key, value);
  } catch (error) {
    console.log(error);
  }
};

const CacheSetex = (key, ttl, value) => {
  if (typeof key !== "string") throw "Key must be a String";
  if (typeof ttl !== "number") throw "TTL must be a number";
  try {
    if (typeof value === "object") {
      redisCache.setex(key, ttl, JSON.stringify(value));
    } else redisCache.setex(key, ttl, value);
  } catch (error) {
    console.log(error);
  }
};

const CacheGet = async (key, json) => {
  if (typeof key !== "string") throw "Key must be a String";
  try {
    const data = await getCacheAsync(key);
    if (data) {
      if (json && typeof data === "string") {
        return JSON.parse(data);
      } else return data;
    } else return undefined;
  } catch (error) {
    console.log(error);
  }
};

const CacheDel = async (key) => {
  if (typeof key !== "string") throw "Key must be a String";
  try {
    redisCache.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { CacheSet, CacheSetex, CacheGet, CacheDel };

/*
 Cache Key Prefixs:
 Rd: Reddit posts 


*/
