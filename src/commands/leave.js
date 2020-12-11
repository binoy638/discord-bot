module.exports = {
  name: "leave",
  active: false,
  description: "Make bot leave a voice channel",
  execute(message, args) {
    if (message.guild.voice.connection) {
      let vc = message.guild.voice.connection;
      vc.disconnect();
    }
  },
};
