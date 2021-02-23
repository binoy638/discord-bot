const Commando = require("discord.js-commando");
const add = require("../../functions/music/playlist/add");
const getplaylist = require("../../functions/music/getplaylist");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlistadd",
      group: "music",
      memberName: "8playlistadd",
      aliases: ["playlistadd", "playlist_add", "addtrack", "add"],
      description: "Add tracks to your playlist.",
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
        let musicPlayer = musicPlayerInstance(message.channel);
        if (musicPlayer.isQueueEmpty()) {
          return message.reply(
            "No music is playing currently to add to your playlist.\nPlay a song before you use this command or provide a spotify playlist."
          );
        }
        const currentTrack = musicPlayer.currentSong();

        const response = await add(id, currentTrack);

        if (response === true) {
          return message.reply(
            `\`${currentTrack.track}\` added to your playlist.`
          );
        } else {
          message.reply(
            "Something went wrong,song not added to your playlist."
          );
        }
      } catch {
        return message.reply(
          "No music is playing currently to add to your playlist.\nPlay a song before you use this command or provide a spotify playlist."
        );
      }

      return message.channel.reply(
        "Currently playing song added to your playlist"
      );
    } else {
      const slug = url.split("/").pop();
      const playlist = await getplaylist(slug);

      if (!playlist) {
        return message.reply("Can't fetch playlist.\nCheck your playlist url.");
      }
      const response = await add(id, playlist.tracks);

      if (response === true) {
        return message.reply("Spotify playlist added.");
      } else {
        message.reply("Something went wrong,Playlist not added.");
      }
    }
  }
};
