const { MessageButton, MessageActionRow } = require("discord-buttons");
const { search } = require("ffmpeg-static");

module.exports = (isAiring = false) => {
  const searchNext = new MessageButton()
    .setStyle("blurple")
    .setLabel("Next")
    .setID(`anime-search-next`);

  const enableNotification = new MessageButton()
    .setStyle("green")
    .setLabel("Enable Notification")
    .setID("anime-notification")
    .setDisabled(true);

  const searchPrevious = new MessageButton()
    .setStyle("blurple")
    .setLabel("Prev")
    .setID(`anime-search-prev`);

  const searchTorrent = new MessageButton()
    .setStyle("blurple")
    .setLabel("Torrent")
    .setID(`anime-torrent`);

  if (isAiring) enableNotification.setDisabled(false);

  return new MessageActionRow().addComponents([
    searchPrevious,
    enableNotification,
    searchNext,
    searchTorrent,
  ]);
};
