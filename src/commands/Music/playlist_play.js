const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const cache = require("../../functions/cache");
const ytdl = require("discord-ytdl-core");

const find = require("../../functions/music/playlist/find");
const MusicPlayer = require("../../functions/music/musicPlayer");
const statusMsg = require("../../functions/music/statusMsg");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const search = require("../../functions/music/search");
const addplayerInfo = require("../../functions/music/addplayerInfo");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "playlist_play",
      group: "music",
      memberName: "playlist_play",

      description: "Play your playlist",
      args: [
        {
          key: "id",
          prompt: "Which track you want to play?",
          type: "integer",
          default: "1",
        },
      ],
    });
  }
  async run(message, args) {
    const trackno = args.id;
    const { id } = message.member.user;
    const { voice } = message.member;
    const playlist = await find(id);
    if (!playlist) {
      return message.reply("You don't have a playlist.");
    }

    if (!voice.channelID) {
      message.reply("You must be in a voice channel");
      return;
    }

    let musicPlayer = musicPlayerInstance(message.channel);

    musicPlayer.clearQueue();
    musicPlayer.addplaylist(playlist);

    const connection = await voice.channel.join();
    async function playSong(connection, channel, musicPlayer) {
      let currentSong = musicPlayer.currentSong();
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

      statusMsg(currentSong, channel, "playing");
      dispatcher.on("finish", () => {
        musicPlayer.skipSong();
        console.log("skipping song");
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
