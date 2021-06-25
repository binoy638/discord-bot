const Commando = require("discord.js-commando");
const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
    });
  }
  async run(message, args) {
    let NextButton = new MessageButton()
      .setStyle("green")
      .setEmoji("⏭️")
      .setID("next");

    let PlayButton = new MessageButton()
      .setStyle("green")
      .setEmoji("⏯️")
      .setID("pause-play");

    let PrevButton = new MessageButton()
      .setStyle("green")
      .setEmoji("⏮️")
      .setID("previous");

    // let buttonRow = new MessageActionRow();

    let buttonRow2 = new MessageActionRow()

      .addComponent(PrevButton)
      .addComponent(PlayButton)
      .addComponent(NextButton);

    message.channel.send("Hi", { components: buttonRow2 });
  }
};
