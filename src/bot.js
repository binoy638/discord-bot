//Imports

//basic imports
const fs = require("fs");

require("dotenv").config();

// discord imports

const Discord = require("discord.js");

// db import
const mongo = require("./mongo");

// misc import
const onJoin = require("./functions/onJoin");
const time = require("./functions/time");
const { Globalprefix } = require("./config.json");
const getprefix = require("./functions/getprefix");
const getsublist = require("./functions/ninegag/getsublist");
const getalertsublist = require("./functions/animeAlerts/alertsublist");

//cache
var cache = require("./functions/cache");

const cronjob = require("./functions/ninegag/SetJobs");
const job = require("./functions/JobManager");
const alertjob = require("./functions/animeAlerts/setJobs");
// const nineSchema = require("./schemas/ninegagSchema");

// create a new discord client
const client = new Discord.Client();

const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

/**
 * readdirSync returns an array with all files in the specified directory
 * filter the files with .js extension and store it in commandFiles
 */
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// One time function that triggers when the client is ready

client.once("ready", async () => {
  console.log("Bot is connected");
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

// Function to handle users commands to the bot

client.on("message", async (message) => {
  // ignore a message that doesn't starts with prefix or its a bot message

  const { guild } = message;

  let guildPrefix = cache.get(`prefix-${guild.id}`);

  if (!guildPrefix) {
    guildPrefix = await getprefix(`prefix-${guild.id}`);
    cache.set(`prefix-${guild.id}`, guildPrefix);
  }

  // console.log(cache);
  const prefix = guildPrefix || Globalprefix;

  exports.prefix = prefix;
  if (!message.content.startsWith(prefix) || message.author.bot) {
    // const emojis = [
    //   "619842959931867167",
    //   "758716930109603861",
    //   "361065875337379841",
    //   "758716679449608263",
    //   "758717642503618640",
    //   "719159618265415704",
    //   "757981987595223161",
    //   "586832456427241482",
    //   "785757397503180813",
    //   "537725587926679552",
    //   "758720169077112844",
    // ];
    // const rand = Math.floor(Math.random() * Math.floor(emojis.length));
    // // console.log(rand);
    // const isreact = Math.round(Math.random() * 1);
    // // const emojiList = message.guild.emojis.cacheType; //<:KEKW:619842959931867167> <:pepecross:758716930109603861> <:FeelsBadMan:361065875337379841> <:FeelsStrongMen:758716679449608263>  <:pepelaugh:758717642503618640> <:pepega:719159618265415704>
    // // console.log(JSON.stringify(emojiList));
    // if (!message.author.bot) {
    //   if (isreact === 0) {
    //     setTimeout(function () {
    //       message.react(emojis[rand]);
    //     }, 3000);
    //   }
    // }
    return;
  }

  // extract the agruments from a message and store it in "args" as an array
  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command || command.active !== true) return;

  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  if (command.args && command.args_limit) {
    if (command.args_limit !== args.length) {
      let reply = `I was expecting ${command.args_limit} arguments but u provided ${args.length} <:pepega:719159618265415704>, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be:\n\`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }
  }

  //cooldown

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      timeLeft = time(timeLeft.toFixed(1));

      return message.reply(
        `\`!${command.name}\` is on cooldown for \`${timeLeft}\`.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //execute commands
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

// Login to discord bot token
client.login(process.env.TOKEN);
