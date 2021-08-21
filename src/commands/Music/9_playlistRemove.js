const Commando = require("discord.js-commando");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
const { find, remove } = require("../../utils/music/playlist/helper");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playlistremove",
      group: "music",
      memberName: "9playlistremove",
      aliases: ["plr", "playlist_remove", "remove"],
      description: "Remove track from your playlist.",
      args: [
        {
          key: "track",
          prompt: "Which track do you want to remove from your playlist?",
          type: "integer",
          min: 1,
        },
      ],
    });
  }
  async run(message, args) {
    const trackno = args.track - 1;
    const { id } = message.member.user;
    const prefix = message.guild._commandPrefix;

    const playlist = await find(id);

    if (!playlist) {
      return ErrorEmbed(
        `You don't have any playlist currently.\nUse \`${prefix}playlistadd\` to create a playlist.`,
        message.channel
      );
    }

    const track = playlist[trackno];
    if (track) {
      const resp = await remove(id, track);
      if (resp === true) {
        return SuccessEmbed(`\`${track.track}\` removed`, message.channel);
      } else {
        return ErrorEmbed(
          "Something went wrong couldn't remove track.",
          message.channel
        );
      }
    }
    return ErrorEmbed(
      `Can't find track no ${args.track} in your playlist`,
      message.channel
    );
  }
};
