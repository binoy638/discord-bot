const path = require("path");
const fs = require("fs");
const Commando = require("discord.js-commando");
const { agenda } = require("./configs/agenda");
const animeTimer = require("./utils/animeAlerts/animeTimer");

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
  console.log("inside job def");
  const { channelID, animeID, animeImage, animeTitle } = job.attrs.data;
  const channel = client.channels.cache.get(channelID);
  animeTimer({ id: animeID, image: animeImage, title: animeTitle }, channel);
});

client.login(process.env.TOKEN);
