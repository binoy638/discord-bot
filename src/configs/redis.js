const redis = require("redis");
const REDIS_URL = process.env.REDIS_URL;
require("dotenv").config();

module.exports = (client) => {
  const pub = redis.createClient(REDIS_URL);

  const expired = () => {
    const sub = redis.createClient(REDIS_URL);
    sub.subscribe("__keyevent@0__:expired", () => {
      sub.on("message", async (channel, key) => {
        if (key.indexOf("animeJob") !== -1) {
          const { retryJob } = require("../utils/anime/helper");
          const [prefix, id, attempts] = key.split("-");
          const isDone = await retryJob(id, attempts, client);

          const a = attempts - 1;
          if (!isDone && attempts > 0) {
            pub.setex(`animeJob-${id}-${a}`, 600, "true");
          }
        }
        if (key.indexOf("test") !== -1) {
          console.log("test key expired");
          pub.setex("test:123", 60, "true");
        }
      });
    });
  };

  pub.send_command(
    "config",
    ["set", "notify-keyspace-events", "Ex"],
    expired()
  );

  pub.on("error", function (err) {
    console.log("Error " + err);
  });

  pub.on("ready", () => {
    console.log("Redis is ready");
  });

  pub.on("end", () => {
    console.log("Redis terminated");
  });

  return pub;
};
