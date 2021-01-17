var cache = require("../functions/cache");
module.exports = {
  name: "ping",
  description: "Ping!",
  active: false,
  async execute(message, args) {
    let check = cache.has("myKey");
    if (check) {
      value = cache.get("myKey");
      console.log(value);
      return;
    }
    obj = { my: "Special", variable: 42 };
    success = cache.set("myKey", obj, 10);
    console.log(success);
  },
};
