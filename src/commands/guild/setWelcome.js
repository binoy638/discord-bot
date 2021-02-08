const mongo = require("../../mongo");
const welcomeSchema = require("../../schemas/welcome-schema");
var cache = require("../../functions/cache");
module.exports = {
  name: "setwelcomemsg",
  description: "Set welcome message for new user joins.",
  category: "Guild",
  active: true,
  args: true,
  cooldown: 86400,
  async execute(message, args) {
    const { member, channel, guild } = message;

    if (!member.hasPermission("ADMINISTRATOR")) {
      channel.send("You do not have permission to run this command.");
    }
    let text = args.join(" ");

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
        cache.set(`welmsg${guild.id}`, [channel.id, text]);
      } finally {
        mongoose.connection.close();
      }
    });
    message.channel.send(
      `Welcome message for this guild has been set to \n\`${text}\``
    );
  },
};
