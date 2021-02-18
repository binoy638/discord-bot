const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const play = require("../../functions/music/play");
const find = require("../../functions/music/playlist/find");
const show = require("../../functions/music/playlist/show");
const add = require("../../functions/music/playlist/add");
const getplaylist = require("../../functions/music/getplaylist");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "add",
      group: "music",
      memberName: "add",
      description: "Manage your playlist.",
      args: [
        {
          key: "track",
          prompt: "What you want to add to your playlist?",
          type: "string",
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const url = args.track;
    const { id } = message.member.user;
    if (!url) {
      try {
        const musicPlayer = cache.get(message.channel.id);
        const currentTrack = musicPlayer.currentSong();
        const tracks = await find(id);
        let index = 1;
        if (tracks) {
          index = tracks.length + 1;
        }

        const response = await add(id, {
          _id: index,
          track: currentTrack.song ? currentTrack.song : currentTrack.title,
          artists: currentTrack.artist ? currentTrack.artist : "",
          playerInfo: {
            link: currentTrack.link,
            title: currentTrack.title,
            image: currentTrack.image,
          },
        });

        if (response === true) {
          return message.channel.send(
            `${currentTrack.title} added to your playlist.`
          );
        } else {
          message.channel.send(
            "Something went wrong,song not added to your playlist."
          );
        }
      } catch {
        return message.channel.send("No music is playing currently");
      }

      return message.channel.send(
        "Currently playing song added to your playlist"
      );
    } else {
      const slug = url.split("/").pop();
      const playlist = await getplaylist(slug);

      if (!playlist) {
        return message.channel.send("Can't fetch playlist.");
      }
      const response = await add(id, playlist.tracks);

      if (response === true) {
        return message.channel.send("Spotify playlist added.");
      } else {
        message.channel.send("Something went wrong,Playlist not added.");
      }
    }
  }
};
