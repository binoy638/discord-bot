const job = require("../../functions/JobManager");
const mongo = require("../../mongo");
const nineSchema = require("../../models/ninegag");

const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "stop_autoposts",
      group: "fun",
      memberName: "stop_autoposts",
      description: "Stop the bot from autoposting.",
      userPermissions: ["ADMINISTRATOR"],
    });
  }
  async run(message) {
    const { channel } = message;

    const JobId = `job-${channel.id}`;
    const check = job.exists(JobId);
    if (check === true) {
      await mongo().then(async (mongoose) => {
        try {
          await nineSchema.findOneAndUpdate(
            {
              channel: channel.id,
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
  }
};
