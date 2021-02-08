const mongo = require("../../mongo");
const valoSchema = require("../../schemas/valorant-stats-schema");
module.exports = {
  name: "setvalouser",
  description: "Connect a valorant account with your discord ID.",
  category: "Gaming",
  active: true,
  usage: "[username] [tag]",
  args: true,
  args_limit: 2,

  async execute(message, args) {
    const { member } = message;
    if (args.length === 2) {
      const valorant_user_id = args[0];
      const valorant_tag = args[1];

      await mongo().then(async (mongoose) => {
        try {
          await valoSchema.findOneAndUpdate(
            {
              _id: member.user.id,
            },
            {
              _id: member.user.id,
              valo_user: valorant_user_id,
              valo_tag: valorant_tag,
            },
            {
              upsert: true,
            }
          );
        } finally {
          mongoose.connection.close();
        }
      });
      message.channel.send(
        `\`${valorant_user_id}#${valorant_tag}\` successfully linked with your discord ID.`
      );
    } else {
      message.channel.send("please follow the proper format");
    }
  },
};
