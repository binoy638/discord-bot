var cache = require("../functions/cache");
module.exports = {
  name: "ping",
  description: "Ping!",
  active: false,

  execute(message, args) {
    let token = cache.get("spotify-access-token");
    if (!token) {
      cache.set("spotify-access-token", "1234233", 20);
      console.log("new token created");
      console.log(cache);
      return;
    }
    console.log("token exists");
    console.log(token);
  },
};
