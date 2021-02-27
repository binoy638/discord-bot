const Commando = require("discord.js-commando");
const ytdl = require("discord-ytdl-core");
const find = require("../../functions/music/playlist/find");
const statusMsg = require("../../functions/music/statusMsg");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const search = require("../../functions/music/search");
const addplayerInfo = require("../../functions/music/addplayerInfo");
const cache = require("../../functions/cache");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlistplay",
      group: "music",
      memberName: "6playlistplay",
      aliases: ["plp", "playlist_play", "playplaylist"],
      description: "Play your tracks from your playlist",
      args: [
        {
          key: "shuffle",
          prompt: "Do you want to shuffle your playlist?",
          type: "string",
          oneOf: ["shuffle"],
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const shuffle = args.shuffle;
    const prefix = message.guild._commandPrefix;
    const { id } = message.member.user;
    const { voice } = message.member;
    let playlist = cache.get(`Playlist-${id}`);
    if (!playlist) {
      playlist = await find(id);
      cache.set(`Playlist-${id}`, playlist);
    }

    if (!playlist) {
      return message.reply(
        `You don't have any playlist currently.\nUse \`${prefix}playlistadd\` to create a playlist.`
      );
    }

    if (!voice.channelID) {
      message.reply("You must be in a voice channel");
      return;
    }

    let musicPlayer = musicPlayerInstance(message.channel);
    const botcurrentVC = message.guild.me.voice.channel;
    if (botcurrentVC) {
      const existingVc = musicPlayer.getCurrentVoiceChannel();
      if (existingVc !== voice.channel.id) {
        const status = musicPlayer.getStatus();
        if (status !== 0) {
          return message.reply("Already playing music in some other channel.");
        }
      }
    }
    musicPlayer.flushcache();
    musicPlayer.setVoiceChannel(voice.channel.id);
    musicPlayer.addplaylist(playlist);

    if (shuffle) {
      musicPlayer.shufflePlaylist();
    }

    const connection = await voice.channel.join();
    async function playSong(connection, channel, musicPlayer) {
      let currentSong = musicPlayer.currentSong();
      if (!currentSong) {
        return;
      }
      if (!currentSong.playerInfo) {
        const searchQuery = `${currentSong.artists} ${currentSong.track}`;
        const playerInfo = await search(searchQuery);
        currentSong.playerInfo = playerInfo;
        addplayerInfo(id, currentSong);
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
        if (musicPlayer.isQueueEmpty === true) {
          connection.disconnect();
        } else {
          setTimeout(() => {
            playSong(connection, channel, musicPlayer);
          }, 1000);
        }
      });
    }

    playSong(connection, message.channel, musicPlayer);
  }
};
