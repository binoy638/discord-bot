const animesublistclear = require("../functions/animeAlerts/animesublistclear");

module.exports = {
  name: "guildDelete",
  execute(guild) {
    animesublistclear(guild.id);
  },
};
