const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = (slug1, slug2, slug3) => {
  let q480Button = new MessageButton()
    .setStyle("url")
    .setLabel("480p")
    .setURL(`https://udility.herokuapp.com/redirect/${slug1}`);

  let q720Button = new MessageButton()
    .setStyle("url")
    .setLabel("720p")
    .setURL(`https://udility.herokuapp.com/redirect/${slug2}`);

  let q1080Button = new MessageButton()
    .setStyle("url")
    .setLabel("1080p")
    .setURL(`https://udility.herokuapp.com/redirect/${slug3}`);
  return new MessageActionRow().addComponents([
    q480Button,
    q720Button,
    q1080Button,
  ]);
};
