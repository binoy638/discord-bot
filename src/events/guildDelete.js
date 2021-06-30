const { agenda } = require("../configs/agenda");

module.exports = {
  name: "guildDelete",
  async execute(guild) {
    await agenda.cancel({ name: "animeTimer", "data.guildID": guild.id });
    console.log(`AnimeTimer deleted for guild ${guild.id}(guild deleted)`);
  },
};
