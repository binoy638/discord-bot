const ytdl = require("discord-ytdl-core");
const search = require("../functions/music/search");
const statusMsg = require("../functions/music/statusMsg");
module.exports = {
  name: "play",
  usage: "<song name>",
  description: "Play music in a voice channel",
  active: true,
  args: true,

  async execute(message, args) {
    const query = args.join(" ");
    const result = await search(query);
    if (!result) {
      message.channel.send("No results found");
    }
    if (!ytdl.validateURL(result.link)) {
      message.channel.send("No results found");
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("No voice channel.");
    let stream = ytdl(result.link, {
      filter: "audioonly",
      opusEncoded: true,
    });
    voiceChannel.join().then((connection) => {
      connection.play(stream, {
        type: "opus",
      });
      statusMsg(result, message.channel);
    });
  },
};
