const job = require("../functions/SetJobs");
const NineGag = require("../functions/ninegag");
const mongo = require("../mongo");
const nineSchema = require("../schemas/ninegagSchema");

module.exports = {
  name: "get9gag",
  description: "Get regular posts from your favrouite 9gag section.",
  usage: "<section> <interval(in mins)>",
  active: true,
  args: true,
  args_limit: 2,
  cooldown: 5,
  async execute(message, args) {
    const { member, channel } = message;
    if (!member.hasPermission("ADMINISTRATOR")) {
      return channel.send("You do not have permission to run this command.");
    }
    const section = args[0];
    const interval = args[1];

    const nineGagObject = new NineGag(section);
    const status = await nineGagObject.isSectionValid();
    if (status === false) {
      return message.channel.send(
        `Sorry, I can't find a \`${args[0]}\` section in 9gag.`
      );
    }
    await mongo().then(async (mongoose) => {
      try {
        await nineSchema.findOneAndUpdate(
          {
            _channel: channel.id,
          },
          {
            _channel: channel.id,
            section,
            interval,
            active: true,
          },
          {
            upsert: true,
          }
        );
      } catch (e) {
        console.log("not found");
        // cache.clear();
      } finally {
        mongoose.connection.close();
      }
    });

    message.channel.send(
      `Posting a post from ${section} every ${args[1]} mins`
    );
    job(section, interval, channel);
  },
};
