const onJoin = require("../../functions/onJoin");

module.exports = {
  name: "joinsim",
  category: "Misc",
  active: false,
  description: "Simluate a member join",

  execute(message, args) {
    onJoin(message.member);
  },
};
