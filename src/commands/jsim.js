const onJoin = require("../functions/onJoin");

module.exports = {
  name: "joinsim",
  active: false,
  description: "Simluate a member join",

  execute(message, args) {
    onJoin(message.member);
  },
};
