const Commando = require("discord.js-commando");
const { find } = require("../../functions/music/playlist/helper");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const Discordcollection = require("../../functions/utils/Discordcollection");
const play = require("../../functions/music/play");
const { CacheGet, CacheSet } = require("../../functions/cache");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playlistplay",
      group: "music",
      memberName: "6playlistplay",
      aliases: ["plp", "playlist_play", "playplaylist"],
      description: "Play your tracks from your playlist",
    });
  }
  async run(message) {
    const prefix = message.guild._commandPrefix;
    const { id } = message.member.user;
    const { voice } = message.member;

    let playlist = await CacheGet(`Playlist-${id}`, true);
    if (!playlist) {
      playlist = await find(id);
      CacheSet(`Playlist-${id}`, playlist);
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
          return message.reply("❌ already in use.");
        }
      }
    }

    musicPlayer.flushcache();
    musicPlayer.setVoiceChannel(voice.channel.id);
    musicPlayer.addplaylist(playlist);

    const connection = await voice.channel.join();

    play(connection, message.channel, musicPlayer, 0, id);

    //TODO:Check if duplicate event listners are being added
    connection.on("disconnect", () => {
      Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);
      musicPlayer.setStatus(0);
    });
  }
};
