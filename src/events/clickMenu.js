const { MenuID2Filter } = require("../utils/misc/filterOpts");

module.exports = {
  name: "clickMenu",
  async execute(menu) {
    const { client, message } = menu;
    if (menu.id === "AudioFilter") {
      menu.reply.defer();
      const filter = MenuID2Filter[menu.values[0]];
      console.log(filter);
      if (!filter) return;
      const [filterCmd] = client.registry.findCommands("filter", true);

      filterCmd.run(message, { type: filter });
    }
  },
};
