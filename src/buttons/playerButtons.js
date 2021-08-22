const { MessageButton, MessageActionRow } = require("discord-buttons");

let NextButton = new MessageButton()
  .setStyle("green")
  .setEmoji("⏭️")
  .setID("music-player-next");

let PlayButton = new MessageButton().setStyle("green");

let PrevButton = new MessageButton()
  .setStyle("green")
  .setEmoji("⏮️")
  .setID("music-player-previous");

let StopButton = new MessageButton()
  .setStyle("red")
  .setEmoji("⏹️")
  .setID("music-player-stop");

let shuffleButton = new MessageButton()
  .setStyle("green")
  .setEmoji("🔀")
  .setID("music-player-shuffle");

let lyricsButton = new MessageButton()
  .setStyle("green")
  .setEmoji("📜")
  .setID("music-player-lyrics");

// let loopButton = new MessageButton()
//   .setStyle("green")
//   .setEmoji(":repeat:")
//   .setID("music-player-loop");

module.exports = (action) => {
  if (action === "play") {
    PlayButton.setEmoji("⏸️").setID("music-player-pause");
  } else if (action === "pause") {
    PlayButton.setEmoji("▶️").setID("music-player-play");
  } else {
    throw new Error("Unknown Action type");
  }
  return new MessageActionRow().addComponents([
    lyricsButton,
    PlayButton,
    NextButton,
    StopButton,
    shuffleButton,
  ]);
};
