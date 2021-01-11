const checkjob = require("../functions/getcronjob");
const mongo = require("../mongo");
const nineSchema = require("../schemas/ninegagSchema");
const cache = require("../functions/cache");
module.exports = {
  name: "stop9gag",
  description: "Stop 9gag posts in a channel if it's enabled.",

  active: true,

  async execute(message, args) {
    const { member, channel } = message;
    if (!member.hasPermission("ADMINISTRATOR")) {
      return channel.send("You do not have permission to run this command.");
    }
    const check = checkjob(channel.id);
    if (check === true) {
      await mongo().then(async (mongoose) => {
        try {
          await nineSchema.findOneAndUpdate(
            {
              _channel: channel.id,
            },
            {
              active: false,
            },
            {
              upsert: true,
            }
          );
          channel.send("Ok,I won't post anymore.");
          // cache.removeCronJob("Cron Jobs", channel.id);
          // cache.show();
        } catch (e) {
          console.log("not found");
          // cache.clear();
        } finally {
          mongoose.connection.close();
        }
      });
    } else {
      return channel.send("get9gag not enabled in this channel");
    }
  },
};
