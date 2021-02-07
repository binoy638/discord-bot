module.exports = {
  name: "ping",
  description: "Ping!",
  active: true,
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("No voice channel.");
    voiceChannel.join().then((connection) => {
      console.log("playing..");
      connection.play("./sound.mp3");
    });
  },
};
