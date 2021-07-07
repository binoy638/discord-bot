const ytdl = require("discord-ytdl-core");
const queryType = require("../../utils/music/queryType");
// const statusMsg = require("../../utils/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const Discordcollection = require("../../utils/misc/Discordcollection");
const { playlist } = require("../../utils/music/playlist/spotify");
const { infoFromQuery, infoFromLink } = require("../../utils/music/search");
const play = require("../../utils/music/play");
const { SuccessEmbed, ErrorEmbed } = require("../../utils/embed");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      group: "music",
      aliases: ["p", "song", "music"],
      memberName: "1play",
      description: "Play a song.",
      args: [
        {
          key: "query",
          prompt: "Please provide a song name or URL.",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const query = args.query;
    const { channel } = message;
    const QueryType = queryType(query);

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return ErrorEmbed(
        "You need to be in a voice channel to use this command.",
        channel
      );

    const botVoiceChannel = message.guild.me.voice.channel;

    if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id)
      return ErrorEmbed(
        `Bot already present in <#${botVoiceChannel.id}>`,
        channel
      );

    let musicPlayer = musicPlayerInstance(message.channel, voiceChannel.id);
    // const botcurrentVC = message.guild.me.voice.channel;
    // if (botcurrentVC) {
    //   const existingVc = musicPlayer.getCurrentVoiceChannel();
    //   if (existingVc !== voiceChannel.id) {
    //     // const status = musicPlayer.getStatus();
    //     // console.log(status);
    //     // if (status !== 0) {
    //     return ErrorEmbed(
    //       "Already playing music in some other channel.",
    //       channel
    //     );
    //     // }
    //   }
    // }

    switch (QueryType) {
      case 0:
        const track = await infoFromQuery(query);
        if (!track) {
          return ErrorEmbed("No results found", channel);
        }
        if (!ytdl.validateURL(track.playerInfo.link)) {
          return ErrorEmbed("No results found", channel);
        }

        musicPlayer.addSong(track);
        if (musicPlayer.getStatus() !== 0) {
          const queueCount = musicPlayer.queueCount();

          SuccessEmbed(
            `\`${track.track}\` Queued\nTotal Tracks in Queue:\`${queueCount}\``,
            channel
          );
          return;
        }
        break;
      case 1:
        const slug = query.split("/").pop();
        const { tracks } = await playlist(slug);
        musicPlayer.addplaylist(tracks);
        const queueCount = musicPlayer.queueCount();

        SuccessEmbed(
          `\`${tracks.length}\` Tracks added to queue.\nTotal ${queueCount} in queue.`,
          channel
        );
        break;
      case 2:
        const Track = await infoFromLink(query);
        if (!Track) {
          return ErrorEmbed("No results found", channel);
        }
        if (!ytdl.validateURL(Track.playerInfo.link)) {
          return ErrorEmbed("No results found", channel);
        }

        musicPlayer.addSong(Track);
        if (musicPlayer.getStatus() !== 0) {
          const queueCount = musicPlayer.queueCount();

          SuccessEmbed(
            `\`${track.track}\` Queued\nTotal Tracks in Queue:\`${queueCount}\``,
            channel
          );
          return;
        }
        break;
      case 3:
        //TODO youtube playlist
        break;
      case 4:
        return ErrorEmbed("Invalid link please try again.", channel);

      default:
        return ErrorEmbed("Something went wrong, please try again.", channel);
    }

    const connection = await voiceChannel.join();

    play(connection, message.channel, musicPlayer);
    //TODO:Check if duplicate event listners are being added
    connection.on("disconnect", () => {
      Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);
      musicPlayer.setStatus(0);
    });
  }
};
