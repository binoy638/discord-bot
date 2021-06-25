const mongo = require("../../configs/mongo");
const welcomeSchema = require("../../models/welcome");
const Commando = require("discord.js-commando");
const { CacheSet } = require("../../functions/cache");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "welcome",
      group: "guild",
      memberName: "welcome",
      description: "Set welcome message for new user join.",
      args: [
        {
          key: "welmsg",
          prompt: "Please enter a welcome message.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const { member, channel, guild } = message;

    if (!member.hasPermission("ADMINISTRATOR")) {
      channel.send("You do not have permission to run this command.");
    }
    let text = args.welmsg;

    await mongo().then(async (mongoose) => {
      try {
        await welcomeSchema.findOneAndUpdate(
          {
            _id: `welmsg${guild.id}`,
          },
          { _id: `welmsg${guild.id}`, channelId: channel.id, text },
          {
            upsert: true,
          }
        );
        CacheSet(`welmsg${guild.id}`, [channel.id, text]);
      } finally {
        mongoose.connection.close();
      }
    });
    message.channel.send(
      `Welcome message for this guild has been set to \n\`${text}\``
    );
  }
};
