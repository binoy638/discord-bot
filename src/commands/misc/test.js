const events = require("events");
const player = new events.EventEmitter();
const stream = require("stream");
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const ytdl = require("discord-ytdl-core");
const { infoFromLink } = require("../../functions/music/search");
const path = require("path");
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
    // const voiceChannel = message.member.voice.channel;
    // const connection = await voiceChannel.join();

    // connection.play(path.join("src/static", "test.mp3"));
    // console.log(connection.dispatcher.streams);
    // setTimeout(() => {
    //   connection.play(path.join("src/static", "test1.mp3"));
    // }, 5000);
    // const broadcast = this.client.voice.createBroadcast();
    // broadcast.play(path.join("src/static", "test.mp3"));
    // // Play "music.mp3" in all voice connections that the client is in
    // for (const connection of this.client.voice.connections.values()) {
    //   connection.play(broadcast);
    // }
    let connection = message.guild.me.voice.connection;
    connection.dispatcher.setVolume(0.5);
  }
};
