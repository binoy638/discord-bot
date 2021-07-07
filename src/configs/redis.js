const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL;

// const redisCache = redis.createClient(REDIS_URL);

// const expired = () => {
//   const sub = redisCache;
//   sub.subscribe("__keyevent@0__:expired", () => {
//     sub.on("message", (channel, message) => {
//       if (message.startsWith("delmsg")) {
//         // deleteMessage(message);
//         deleteMessage(message);
//       }
//     });
//   });
// };
const pub = redis.createClient(REDIS_URL);

// pub.send_command("config", ["set", "notify-keyspace-events", "Ex"], expired());

pub.on("error", function (err) {
  console.log("Error " + err);
});

pub.on("ready", () => {
  console.log("Redis is ready");
});

pub.on("end", () => {
  console.log("Redis terminated");
});

module.exports = pub;

/*
 Cache Key Prefixs:
 Rd: Reddit posts 


*/
