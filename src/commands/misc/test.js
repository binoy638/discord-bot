const Commando = require("discord.js-commando");
module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
      args: [
        {
          key: "url",
          prompt: "Enter url",
          type: "string",
        },
      ],
    });
  }
  async run(message, args) {
    const url = args.url;
    const regex = /^(?:http(s)?:\/\/open\.spotify\.com\/playlist\/)/;
    const urlregex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    console.log(regex.test(url));
  }
};
