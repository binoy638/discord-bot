const onJoin = require("../utils/onJoin");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    onJoin(member);
  },
};
