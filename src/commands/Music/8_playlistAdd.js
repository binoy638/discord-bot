const Commando = require("discord.js-commando");
const { add } = require("../../utils/music/playlist/helper");
const { playlist: getplaylist } = require("../../utils/music/playlist/spotify");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embed");
module.exports = class AddCommand extends Commando.Command {
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
    const prefix = message.guild._commandPrefix;
    const { id } = message.member.user;
    if (!url) {
      let musicPlayer = musicPlayerInstance(message.channel);
      if (musicPlayer.isQueueEmpty()) {
        return ErrorEmbed(
          "No music is playing currently to add to your playlist.\nPlay a song before you use this command or provide a spotify playlist.",
          message.channel
        );
      }
      const currentTrack = musicPlayer.currentSong();

      const response = await add(id, currentTrack);

      if (response) {
        return SuccessEmbed(
          `\`${currentTrack.track}\` added to your playlist.`,
          message.channel
        );
      }
      ErrorEmbed(
        "Something went wrong,song not added to your playlist.",
        message.channel
      );
    } else {
      const slug = url.split("/").pop();
      const playlist = await getplaylist(slug);

      if (!playlist) {
        return ErrorEmbed(
          "Can't fetch playlist.\nCheck your playlist url.",
          message.channel
        );
      }
      const response = await add(id, playlist.tracks, message.channel);

      if (response) {
        return SuccessEmbed(
          `\`${playlist.tracks.length} tracks\` added to your playlist.\nUse \`${prefix}playlistshow\` to view your playlist.`,
          message.channel
        );
      } else {
        ErrorEmbed("Something went wrong,Playlist not added.", message.channel);
      }
    }
  }
};
