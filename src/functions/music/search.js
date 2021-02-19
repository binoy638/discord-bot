var search = require("youtube-search");
const { htmlUnescape } = require("escape-goat");
const API_KEY = process.env.YOUTUBE_KEY;

var opts = {
  type: "video",
  maxResults: 1,
  videoCategoryId: "10",
  key: API_KEY,
};

module.exports = async (query) => {
  let new_query = query;

  const response = await search(new_query, opts);

  if (response.results) {
    const link = response.results[0].link;

    const thumbnail = response.results[0].thumbnails.default.url;
    const yt_title = htmlUnescape(response.results[0].title);

    return { link, title: yt_title, image: thumbnail };
  }
  return undefined;
};
