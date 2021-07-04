const searchNavButtons = require("../buttons/searchNavButtons");
const { extractIDIndex } = require("../utils/anime/helper");
const { CacheGet } = require("../utils/cache");
const { animeEmbed } = require("../utils/embed");
const musicPlayerInstance = require("../utils/music/musicPlayerInstance");

module.exports = {
  name: "clickButton",
  async execute(button) {
    const { client, message } = button;
    let musicPlayer = musicPlayerInstance(message.channel);
    switch (button.id) {
      case "pause":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [pause] = client.registry.findCommands("pause", true);
        pause.run(message, button.clicker);
        break;
      case "play":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [resume] = client.registry.findCommands("resume", true);
        resume.run(message, button.clicker);
        break;
      case "stop":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [disconnect] = client.registry.findCommands("disconnect", true);
        disconnect.run(message, button.clicker);
        break;
      case "next":
        button.defer();
        if (!musicPlayer) return;
        if (musicPlayer.message.id !== message.id) return;
        const [skip] = client.registry.findCommands("skip", true);
        skip.run(message, button.clicker);
        break;
      case "anime-search-next":
        button.defer();
        let searchResults = await CacheGet(message.id, true);
        if (!searchResults) return;
        const [ID, Index] = extractIDIndex(message.embeds[0]);

        if (!ID || !Index)
          throw new Error(
            `ID or Index not found for message ID: ${message.id}`
          );
        if (!searchResults.length > Index) return;
        const nextAnime = searchResults[Index];

        return message.edit({
          embed: animeEmbed(nextAnime, Index),
          components: searchNavButtons(nextAnime.airing),
        });
      case "anime-search-prev":
        button.defer();
        const _searchResults = await CacheGet(message.id, true);
        if (!_searchResults) return;
        const [prevID, prevIndex] = extractIDIndex(message.embeds[0]);
        if (!prevID || !prevIndex)
          throw new Error(
            `ID or Index not found for message ID: ${message.id}`
          );
        if (!_searchResults.length > prevIndex - 2) return;

        const prevAnime = _searchResults[prevIndex - 2];

        return message.edit({
          embed: animeEmbed(prevAnime, prevIndex - 2),
          components: searchNavButtons(prevAnime.airing),
        });
      case "anime-notification":
        button.defer();

        const [animeID] = extractIDIndex(message.embeds[0]);

        const [enableNotification] = client.registry.findCommands(
          "start",
          true
        );
        return enableNotification.run(message, { animeID: Number(animeID) });
      case "anime-torrent":
        button.defer();
        const query = message?.embeds[0]?.title;
        if (!query) return;
        const [animetorrent] = client.registry.findCommands(
          "animetorrent",
          true
        );
        return animetorrent.run(message, { query }, true);
    }
  },
};
