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
  let isSpotifyFound = false;
  if (spotifyQuery) {
    isSpotifyFound = true;
    new_query = spotifyQuery.search_query;
    var image = spotifyQuery.image;
    var title = `${spotifyQuery.artist} - ${spotifyQuery.track}`;
  }

  const response = await search(new_query, opts);
  if (response.results) {
    const link = response.results[0].link;
    // const title = response.results[0].title;
    // console.log(response.results[0].thumbnails);
    const thumbnail = response.results[0].thumbnails.default.url;
    const yt_title = response.results[0].title;
    if (isSpotifyFound) {
      return { link, title, image };
    }
    return { link, title: yt_title, image: thumbnail };
  }
  return undefined;
};
