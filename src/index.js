const path = require("path");
const fs = require("fs");
const Commando = require("discord.js-commando");
const { agenda } = require("./configs/agenda");

const client = new Commando.Client({
  owner: "312265605715722240",
  commandPrefix: "!",
});

client.login(process.env.TOKEN);

const redis = require("./configs/redis")(client);

module.exports = { redisCache: redis };

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
  const { channelID, animeID, animeImage, animeTitle, animeDay, animeTime } =
    job.attrs.data;

  if (!channelID || !animeID || !animeImage || !animeTitle)
    return console.log(
      "Could not fetch channel all job data attrs.\nAgenda Job: animeTimer"
    );

  const channel = client.channels.cache.get(channelID);
  if (!channel)
    return console.log("Could not fetch channel.\nAgenda Job: animeTimer");
  const id = job.attrs._id;
  const attempts = 10;
  const key = `animeJob-${id}-${attempts}`;
  redis.setex(key, 600, "true");
});
