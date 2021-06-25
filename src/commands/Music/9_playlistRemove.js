const Commando = require("discord.js-commando");
const { CacheGet } = require("../../functions/cache");
const { find, remove } = require("../../functions/music/playlist/helper");
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
    let playlist = await CacheGet(`Playlist-${id}`);
    if (!playlist) {
      playlist = await find(id);
    }

    if (!playlist) {
      return message.reply(
        `You don't have any playlist currently.\nUse \`${prefix}playlistadd\` to create a playlist.`
      );
    }

    const track = playlist[trackno];
    if (track) {
      const resp = await remove(id, track, message.channel);
      if (resp === true) {
        return message.reply(`\`${track.track}\` removed`);
      } else {
        return message.reply("Something went wrong couldn't remove track.");
      }
    }
    return message.reply(`Can't find track no ${args.track} in your playlist`);
  }
};
