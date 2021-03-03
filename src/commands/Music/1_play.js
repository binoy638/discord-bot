const ytdl = require("discord-ytdl-core");
const search = require("../../functions/music/search");
const statusMsg = require("../../functions/music/statusMsg");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const Discordcollection = require("../../functions/utils/Discordcollection");
const { playlist } = require("../../functions/music/playlist/spotify");

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
    const urlregex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const Spotifyregex = /^(?:http(s)?:\/\/open\.spotify\.com\/playlist\/)/;
    let isPlaylist = false;
    if (urlregex.test(query)) {
      if (Spotifyregex.test(query)) {
        const slug = query.split("/").pop();
        var Playlist = await playlist(slug);
        isPlaylist = true;
      }
    }

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
    if (!isPlaylist) {
      const track = await search(query);
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
    } else {
      musicPlayer.addplaylist(Playlist.tracks);
      if (musicPlayer.getStatus() !== 0) {
        const queueCount = musicPlayer.queueCount();
        message.reply(`\`${queueCount}\` Tracks added to queue.`);
        return;
      }
    }

    let connection = await voiceChannel.join();

    async function playSong(connection, channel, musicPlayer) {
      let currentSong = musicPlayer.currentSong();
      if (!currentSong) {
        return;
      }
      if (!currentSong.playerInfo) {
        const searchQuery = `${currentSong.artists} ${currentSong.track}`;
        const PlayerInfo = await search(searchQuery);
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
        musicPlayer.skipSong();
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
