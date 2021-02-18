const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const play = require("../../functions/music/play");
const find = require("../../functions/music/playlist/find");
const show = require("../../functions/music/playlist/show");
const add = require("../../functions/music/playlist/add");
const getplaylist = require("../../functions/music/getplaylist");
const remove = require("../../functions/music/playlist/remove");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "remove",
      group: "music",
      memberName: "remove",
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
    const resp = await remove(id, track);
    if (resp === true) {
      return message.channel.send("Track removed.");
    } else {
      return message.channel.send(
        "Something went wrong couldn't remove track."
      );
    }

    //   try {
    //     const musicPlayer = cache.get(message.channel.id);
    //     const currentTrack = musicPlayer.currentSong();
    //     const response = await add(id, {
    //       track: currentTrack.song ? currentTrack.song : currentTrack.title,
    //       artists: currentTrack.artist ? currentTrack.artist : "",
    //       source: "youtube",
    //     });

    //     if (response === true) {
    //       return message.channel.send(
    //         `${currentTrack.title} added to your playlist.`
    //       );
    //     } else {
    //       message.channel.send(
    //         "Something went wrong,song not added to your playlist."
    //       );
    //     }
    //   } catch {
    //     return message.channel.send("No music is playing currently");
    //   }

    //   return message.channel.send(
    //     "Currently playing song added to your playlist"
    //   );
  }
};
