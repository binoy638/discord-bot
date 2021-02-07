module.exports = {
  name: "leave",
  description: "Make the bot leave a voice channel.",
  active: true,
  async execute(message, args) {
    // const { voice } = message.member;
    // if (!voice.channelID) {
    //   message.reply("You must be in a voice channel");
    //   return;
    // }
    const connection = message.guild.me.voice.channel;
    if (!connection) {
      message.reply("I am not connected to a voice channel.");
    }

    connection.leave();
  },
};
