const { MessageButton, MessageActionRow } = require("discord-buttons");

let NextButton = new MessageButton()
  .setStyle("green")
  .setEmoji("⏭️")
  .setID("next");

let PlayButton = new MessageButton().setStyle("green");

let PrevButton = new MessageButton()
  .setStyle("green")
  .setEmoji("⏮️")
  .setID("previous");

let StopButton = new MessageButton()
  .setStyle("red")
  .setEmoji("⏹️")
  .setID("stop");

module.exports = (action) => {
  if (action === "play") {
    PlayButton.setEmoji("⏸️").setID("pause");
  } else if (action === "pause") {
    PlayButton.setEmoji("▶️").setID("play");
  } else {
    throw new Error("Unknown Action type");
  }
  return new MessageActionRow()
    .addComponent(PrevButton)
    .addComponent(PlayButton)
    .addComponent(NextButton)
    .addComponent(StopButton);
};
