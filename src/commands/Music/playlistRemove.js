const Commando = require("discord.js-commando");
const cache = require("../../functions/cache");
const find = require("../../functions/music/playlist/find");
const remove = require("../../functions/music/playlist/remove");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlistremove",
      group: "music",
      memberName: "playlistremove",
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

    let playlist = cache.get(`Playlist-${id}`);
    if (!playlist) {
      playlist = await find(id);
    }

    const track = playlist[trackno];
    if (track) {
      const resp = await remove(id, track);
      if (resp === true) {
        return message.reply(`\`${track.track}\` removed`);
      } else {
        return message.reply("Something went wrong couldn't remove track.");
      }
    }
    return message.reply(`Can't find track no ${args.track} in your playlist`);
  }
};
