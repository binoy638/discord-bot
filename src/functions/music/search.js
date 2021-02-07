var search = require("youtube-search");
const spotifySearch = require("./spotifySearch");

const API_KEY = process.env.YOUTUBE_KEY;

var opts = {
  type: "video",
  maxResults: 1,
  videoCategoryId: "10",
  key: API_KEY,
};

module.exports = async (query) => {
  const spotifyQuery = await spotifySearch(query);
  let new_query = query;
  if (spotifyQuery) {
    new_query = spotifyQuery.search_query;
    var image = spotifyQuery.image;
    var title = `${spotifyQuery.artist} - ${spotifyQuery.track}`;
  }

  const response = await search(new_query, opts);
  if (response.results) {
    const link = response.results[0].link;
    // const title = response.results[0].title;

    return { link, title, image };
  }
  return undefined;
};
