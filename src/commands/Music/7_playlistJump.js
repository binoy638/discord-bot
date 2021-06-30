const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playlistjump",
      group: "music",
      aliases: ["jmp", "goto", "jump"],
      memberName: "playlistjump",
      description: "Jump tracks in your playlist.",
      args: [
        {
          key: "trackno",
          prompt: "Which track you wanna jump to?",
          type: "integer",
          min: 1,
        },
      ],
    });
  }
  async run(message, args) {
    const trackno = args.trackno;
    let voiceConnection = message.guild.me.voice.connection;

    if (!voiceConnection) {
      return message.reply("No playlist playing currently.");
    }
    let dispatcher = voiceConnection.dispatcher;
    if (!dispatcher) {
      return message.reply("No playlist playing currently.");
    }

    let musicPlayer = musicPlayerInstance(message.channel);
    const status = musicPlayer.setCurrentSong(trackno);
    if (status === false) {
      return message.reply(`Can't find \`track ${trackno}\` in your playlist.`);
    }
    dispatcher.end();
  }
};
