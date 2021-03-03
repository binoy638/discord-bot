var search = require("youtube-search");
const ytdl = require("discord-ytdl-core");
const { htmlUnescape } = require("escape-goat");
const cache = require("../cache");
const API_KEY = process.env.YOUTUBE_KEY;

var opts = {
  type: "video",
  maxResults: 1,
  videoCategoryId: "10",
  key: API_KEY,
};

module.exports = async (query) => {
  let songInfo = cache.get(`SearchQuery:${query}`); //check if song is present in cache

  if (!songInfo) {
    //if song is not in cahce search it using youtube-search
    const response = await search(query, opts);

    if (response.results) {
      const track = response.results[0];
      //destructure required values from the response
      const {
        link,
        title,
        thumbnails: {
          default: { url: thumbnail },
        },
      } = track;

      const info = await ytdl.getBasicInfo(link); //try to find the song title and artist from the video link

      const song = info.videoDetails.media.song;
      const artist = info.videoDetails.media.artist;

      songInfo = {
        track: song ? song : title,
        artists: artist ? artist : "",
        playerInfo: {
          link,
          title: htmlUnescape(title),
          image: thumbnail,
        },
      };

      cache.set(`SearchQuery:${query}`, songInfo); //save the song info in cache for future quries
    }
  }
  return songInfo;
};
