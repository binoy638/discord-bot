const events = require("events");
const player = new events.EventEmitter();
const Commando = require("discord.js-commando");
const musicPlayerInstance = require("../../functions/music/musicPlayerInstance");
const ytdl = require("discord-ytdl-core");
const { infoFromLink } = require("../../functions/music/search");
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
    const track = await infoFromLink(
      "https://www.youtube.com/watch?v=T3bxbVGWy5k&list=RDT3bxbVGWy5k&start_radio=1&ab_channel=GalileoGalileiVEVO"
    );
    console.log(track);
  }
};
