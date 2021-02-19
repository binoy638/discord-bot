const Commando = require("discord.js-commando");
const ytdl = require("discord-ytdl-core");
const find = require("../../functions/music/playlist/find");
const statusMsg = require("../../functions/music/statusMsg");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const search = require("../../functions/music/search");
const addplayerInfo = require("../../functions/music/addplayerInfo");
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
          key: "track",
          prompt: "Which track you want to play?",
          type: "integer",
          default: 1,
          min: 1,
        },
      ],
    });
  }
  async run(message, args) {
    const trackno = args.track;
    const prefix = message.guild._commandPrefix;
    const { id } = message.member.user;
    const { voice } = message.member;
    const playlist = await find(id);
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

    musicPlayer.clearQueue();
    musicPlayer.addplaylist(playlist);
    const status = musicPlayer.setCurrentSong(trackno);
    if (status === false) {
      return message.reply(`Can't find \`track ${trackno}\` in your playlist.`);
    }

    const connection = await voice.channel.join();
    async function playSong(connection, channel, musicPlayer) {
      let currentSong = musicPlayer.currentSong();
      console.log(currentSong);
      if (!currentSong.playerInfo) {
        console.log("inside current song");
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
        musicPlayer.nextSong();
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
