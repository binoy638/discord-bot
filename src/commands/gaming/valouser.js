const mongo = require("../../mongo");
const valoSchema = require("../../models/valorant");
const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "valouser",
      group: "gaming",
      memberName: "valouser",
      description: "Link valorant user ID with your discord ID.",
      args: [
        {
          key: "username",
          prompt: "What is your valorant username?",
          type: "string",
        },
        {
          key: "tag",
          prompt: "what is your valorant tag?",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const { member } = message;

    const valorant_user_id = args.username;
    const valorant_tag = args.tag;

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
  }
};
