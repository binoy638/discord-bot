const mongo = require("../mongo");
const prefixSchema = require("../schemas/prefixSchema");
var cache = require("../functions/cache");
module.exports = {
  name: "setprefix",
  description: "Set custom prefix to use my commands.",
  usage: "<prefix> \nNote: Prefix must be of 1 character",
  active: true,
  cooldown: 86400,
  args: true,
  args_limit: 1,
  async execute(message, args) {
    const { guild } = message;
    if (args[0].length > 1) {
      return message.channel.send(
        `Prefix must be a single charcter like \`("!","@","#","$","%","^","&")\``
      );
    } else {
      const prefix = args[0];
      await mongo().then(async (mongoose) => {
        try {
          await prefixSchema.findOneAndUpdate(
            {
              _id: `prefix-${guild.id}`,
            },
            {
              _id: `prefix-${guild.id}`,
              prefix: prefix,
            },
            {
              upsert: true,
            }
          );
          cache.clear();
        } finally {
          mongoose.connection.close();
        }
      });
      message.channel.send(
        `commad prefix for this guild has been set to \`"${args[0]}"\``
      );
    }
  },
};
