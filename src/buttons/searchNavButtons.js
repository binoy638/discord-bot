const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = (isAiring = false) => {
  const searchNext = new MessageButton()
    .setStyle("blurple")
    .setLabel("Next")
    .setID(`search-next`);

  const enableNotification = new MessageButton()
    .setStyle("green")
    .setLabel("Enable Notification")
    .setID("anime-notification")
    .setDisabled(true);

  const searchPrevious = new MessageButton()
    .setStyle("blurple")
    .setLabel("Prev")
    .setID(`search-prev`);

  if (isAiring) enableNotification.setDisabled(false);

  return new MessageActionRow().addComponents([
    searchPrevious,
    enableNotification,
    searchNext,
  ]);
};
