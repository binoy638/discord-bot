const player = require("../utils/Discordcollection");
const MusicPlayer = require("./musicPlayer");

module.exports = (channel) => {
  let instance = player.get(`MusicPlayer-${channel.guild.id}`);
  if (!instance) {
    const musicPlayer = new MusicPlayer(channel.id);
    player.set(`MusicPlayer-${channel.guild.id}`, musicPlayer);
    instance = player.get(`MusicPlayer-${channel.guild.id}`);
  }

  return instance;
};
