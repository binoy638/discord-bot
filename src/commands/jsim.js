const onJoin = require("../functions/onJoin");

module.exports = {
  name: "joinsim",
  description: "Simluate a member join",

  execute(message, args) {
    onJoin(message.member);
  },
};
