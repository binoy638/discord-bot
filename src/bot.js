//Imports

//basic imports

const path = require("path");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-provider-mongo").MongoDBProvider;

// discord imports

// const Discord = require("discord.js");

// db import
const mongo = require("./mongo");

// misc import
const onJoin = require("./functions/onJoin");
const getsublist = require("./functions/ninegag/getsublist");
const getalertsublist = require("./functions/animeAlerts/alertsublist");

//cache
var cache = require("./functions/cache");

const cronjob = require("./functions/ninegag/SetJobs");
const job = require("./functions/JobManager");
const alertjob = require("./functions/animeAlerts/setJobs");
// const nineSchema = require("./schemas/ninegagSchema");

// create a new discord client
const Commando = require("discord.js-commando");
// const client = new Discord.Client();
const client = new Commando.Client({
  owner: "312265605715722240",
});

client
  .setProvider(
    MongoClient.connect(process.env.DB_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => new MongoDBProvider(client, process.env.DB_NAME))
  )
  .catch(console.error);

// One time function that triggers when the client is ready

client.once("ready", async () => {
  console.log("Bot is connected");
  client.registry
    .registerGroups([
      ["misc", "🔘 miscellaneous commands 🔘"],
      ["music", "🎧 commands to play music 🎧"],
      // ["moderation", "moderation commands"],
      ["guild", "🔴 guild specific commands 🔴"],
      ["fun", "🐸 commands for memes & stuff 🐸"],
      ["gaming", "🎮 gaming specific commands 🎮"],
      ["anime", "💠 anime specific commands 💠"],
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
      help: false,
      prefix: true,
      ping: false,
      eval: false,
      unknownCommand: false,
      commandState: true,
    })
    .registerCommandsIn(path.join(__dirname, "commands"));
  //waiting for database to connect
  await mongo().then((mongoose) => {
    try {
      console.log("Connected to mongo!");
    } finally {
      // closing database connection
      mongoose.connection.close();
    }
  });

  job.add("Cache-Flusher", "0 0 * * 0", () => {
    cache.flushAll();
  });
  job.start("Cache-Flusher");

  const sublist = await getsublist();

  sublist.map((obj) => {
    const channel = client.channels.cache.get(obj._channel);

    cronjob(obj.section, obj.interval, channel);
  });

  const alertsublist = await getalertsublist();
  alertsublist.map((obj) => {
    const channel = client.channels.cache.get(obj.channelId);
    alertjob(obj.anime_id, obj.anime_title, obj.cron_time, channel);
  });
});

//function to greet new guild members when joined

client.on("guildMemberAdd", (member) => {
  onJoin(member);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  // if nobody left the channel in question, return.
  if (
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    newState.channel
  )
    return;

  // otherwise, check how many people are in the channel now
  if (!oldState.channel.members.size - 1)
    setTimeout(() => {
      // if 1 (you), wait five minutes
      if (!oldState.channel.members.size - 1)
        // if there's still 1 member,
        oldState.channel.leave(); // leave
    }, 300000); // (5 min in ms)
});

// Login to discord bot token
client.login(process.env.TOKEN);
