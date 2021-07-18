const Commando = require("discord.js-commando");
const { find } = require("../../utils/music/playlist/helper");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const Discordcollection = require("../../utils/misc/Discordcollection");
const play = require("../../utils/music/play");
const { CacheGet, CacheSet } = require("../../utils/cache");
const { ErrorEmbed } = require("../../utils/embed");
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
    const { channel } = message;
    const { id } = message.member.user;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return ErrorEmbed(
        "You need to be in a voice channel to use this command.",
        channel
      );

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

    let musicPlayer = musicPlayerInstance(message.channel);
    const botcurrentVC = message.guild.me.voice.channel;

    if (botcurrentVC && botcurrentVC.id !== voiceChannel.id)
      return ErrorEmbed(
        `Bot already present in <#${botcurrentVC.id}>`,
        channel
      );

    musicPlayer.flushcache();
    musicPlayer.setVoiceChannel(voiceChannel.id);
    musicPlayer.addplaylist(playlist);

    const connection = await voiceChannel.join();

    play(connection, message.channel, musicPlayer, 0, id);

    if (!musicPlayer.onDisconnectListner) {
      connection.on("disconnect", () => {
        Discordcollection.delete(`MusicPlayer-${message.channel.guild.id}`);
        musicPlayer.setStatus(0);
      });
      connection.on("error", (error) => {
        console.log("Error: could not play song");
        console.error(error);
      });
      connection.on("failed", (error) => {
        console.log("Error: connection failed");
        console.error(error);
      });
      musicPlayer.onDisconnectListner = true;
    }
  }
};
