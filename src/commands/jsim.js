const onJoin = require("../functions/onJoin");

module.exports = {
  name: "joinsim",
  active: true,
  description: "Simluate a member join",

  execute(message, args) {
    onJoin(message.member);
  },
};
