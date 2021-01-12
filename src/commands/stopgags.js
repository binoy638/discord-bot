const job = require("../functions/JobManager");
const mongo = require("../mongo");
const nineSchema = require("../schemas/ninegagSchema");

module.exports = {
  name: "stop9gag",
  description: "Stop 9gag posts in a channel if it's enabled.",

  active: true,

  async execute(message, args) {
    const { member, channel } = message;
    if (!member.hasPermission("ADMINISTRATOR")) {
      return channel.send("You do not have permission to run this command.");
    }
    const JobId = `job-${channel.id}`;
    const check = job.exists(JobId);
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

          job.delete(JobId);
          console.log(`${JobId} Deleted`);
          channel.send("Ok,I won't post anymore.");
        } catch (e) {
          console.log("not found");
        } finally {
          mongoose.connection.close();
        }
      });
    } else {
      return channel.send("get9gag not enabled in this channel");
    }
  },
};
