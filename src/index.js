const path = require("path");
const fs = require("fs");
const Commando = require("discord.js-commando");
const { agenda } = require("./configs/agenda");
const animeTimer = require("./utils/anime/animeTimer");

const client = new Commando.Client({
  owner: "312265605715722240",
  commandPrefix: "!",
});

client.login(process.env.TOKEN);

// const redis = require("./configs/redis")(client);

// module.exports = { redisCache: redis };

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

const Animejob = async (attempts, args, channel, retryCount = 0) => {
  if (retryCount > attempts) return;
  console.log(`Attempt: ${retryCount}`);
  const isSuccess = await animeTimer(args, channel);
  retryCount = retryCount + 1;
  if (!isSuccess) {
    console.log("Job failed retrying");
    setTimeout(Animejob, 600000, attempts, args, channel, retryCount);
  }
};

agenda.define("animeTimer", async (job) => {
  const { channelID, animeID, animeImage, animeTitle, animeDay, animeTime } =
    job.attrs.data;
  console.log(`Anime Job started: ${animeTitle}`);
  if (!channelID || !animeID || !animeImage || !animeTitle)
    return console.log(
      "Could not fetch channel all job data attrs.\nAgenda Job: animeTimer"
    );

  const channel = client.channels.cache.get(channelID);
  if (!channel)
    return console.log("Could not fetch channel.\nAgenda Job: animeTimer");

  Animejob(
    10,
    {
      id: animeID,
      image: animeImage,
      title: animeTitle,
      Day: animeDay,
      Time: animeTime,
    },
    channel
  );
  // const id = job.attrs._id;
  // const attempts = 10;
  // const key = `animeJob-${id}-${attempts}`;
  // redis.setex(key, 600, "true");
});
