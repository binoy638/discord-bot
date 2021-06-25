const onJoin = require("../functions/onJoin");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    onJoin(member);
  },
};
