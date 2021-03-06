const ytdl = require("discord-ytdl-core");
const queryType = require("../../functions/music/queryType");
const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const Discordcollection = require("../../functions/utils/Discordcollection");
const { playlist } = require("../../functions/music/playlist/spotify");
const { infoFromQuery, infoFromLink } = require("../../functions/music/search");

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

    const QueryType = queryType(query);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("No voice channel.");

    let musicPlayer = musicPlayerInstance(message.channel, voiceChannel.id);
    const botcurrentVC = message.guild.me.voice.channel;
    if (botcurrentVC) {
      const existingVc = musicPlayer.getCurrentVoiceChannel();
      if (existingVc !== voiceChannel.id) {
        const status = musicPlayer.getStatus();
        console.log(status);
        if (status !== 0) {
          return message.reply("Already playing music in some other channel.");
        }
      }
    }

    switch (QueryType) {
      case 0:
        console.log("inside query");
        const track = await infoFromQuery(query);
        if (!track) {
          return message.channel.send("No results found");
        }
        if (!ytdl.validateURL(track.playerInfo.link)) {
          return message.channel.send("No results found");
        }

        musicPlayer.addSong(track);
        if (musicPlayer.getStatus() !== 0) {
          const queueCount = musicPlayer.queueCount();
          message.reply(
            `\`${track.track}\` Queued\nTotal Tracks in Queue:\`${queueCount}\``
          );
          return;
        }
        break;
      case 1:
        const slug = query.split("/").pop();
        const { tracks } = await playlist(slug);
        musicPlayer.addplaylist(tracks);
        const queueCount = musicPlayer.queueCount();
        message.reply(
          `\`${tracks.length}\` Tracks added to queue.\nTotal ${queueCount} in queue.`
        );
        break;
      case 2:
        const Track = await infoFromLink(query);
        if (!Track) {
          return message.channel.send("No results found");
        }
        if (!ytdl.validateURL(Track.playerInfo.link)) {
          return message.channel.send("No results found");
        }

        musicPlayer.addSong(Track);
        if (musicPlayer.getStatus() !== 0) {
          const queueCount = musicPlayer.queueCount();
          message.reply(
            `\`${Track.track}\` Queued\nTotal Tracks in Queue:\`${queueCount}\``
          );
          return;
        }
        break;
      case 3:
        //TODO youtube playlist
        break;
      case 4:
        return message.reply("Invalid link please try again.");
        break;
      default:
        return message.reply("Something went wrong, please try again.");
    }

    let connection = await voiceChannel.join();

    async function playSong(connection, channel, musicPlayer) {
      let currentSong = musicPlayer.currentSong();
      if (!currentSong) {
        return;
      }
      if (!currentSong.playerInfo) {
        const searchQuery = `${currentSong.artists} ${currentSong.track}`;
        const PlayerInfo = await infoFromQuery(searchQuery);
        currentSong.playerInfo = PlayerInfo.playerInfo;
      }
      const stream = ytdl(currentSong.playerInfo.link, {
        filter: "audioonly",
        opusEncoded: true,
      });
      const dispatcher = connection.play(stream, { type: "opus" });
      musicPlayer.setStatus(1);
      const msg = await statusMsg(currentSong, channel, "playing");
      dispatcher.on("finish", () => {
        musicPlayer.nextSong();
        msg.delete();
        if (musicPlayer.isQueueEmpty() === true) {
          connection.disconnect();
        } else {
          setTimeout(() => {
            playSong(connection, channel, musicPlayer);
          }, 1000);
        }
      });
    }

    playSong(connection, message.channel, musicPlayer);

    connection.on("disconnect", () => {
      Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);
      musicPlayer.setStatus(0);
    });
  }
};
