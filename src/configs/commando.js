const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-provider-mongo").MongoDBProvider;
require("dotenv").config();

module.exports = (client) => {
  client
    .setProvider(
      MongoClient.connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((client) => new MongoDBProvider(client, process.env.DB_NAME))
    )
    .catch(console.error);

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
    .registerCommandsIn(path.join(__dirname, "../commands"));
};
