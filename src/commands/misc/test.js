const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
      // args: [
      //   {
      //     key: "test",
      //     prompt: "test",
      //     type: "integer",
      //   },
      // ],
    });
  }
  async run(message, args) {
    const { channel } = message;

    const connection = message.guild.me.voice.connection;

    if (!connection) {
      return channel.send(`No song is playing to apply filters.`);
    }
    const dispatcher = connection.dispatcher;
    if (!dispatcher) {
      return channel.send("No song is playing to apply filters");
    }
    const seekTime = dispatcher.streamTime / 1000;
    const seek = (dispatcher.streamTime - dispatcher.pausedTime) / 1000;
    console.log(seekTime);
    console.log(seek);
  }
};
