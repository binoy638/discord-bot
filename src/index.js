const path = require("path");
const fs = require("fs");
const Commando = require("discord.js-commando");
const { agenda } = require("./configs/agenda");

const client = new Commando.Client({
  owner: "312265605715722240",
  commandPrefix: "!",
});

require("discord-buttons")(client);
require("./configs/commando")(client);

const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

agenda.define("animeTimer", async (job) => {
  const { channelID, guildID, animeID, cornTime, animeTitle, animeImage } =
    job.attrs.data;
  const channel = client.channels.cache.get(channelID);
});

client.login(process.env.TOKEN);
