var search = require("youtube-search");
const ytdl = require("discord-ytdl-core");
const { htmlUnescape } = require("escape-goat");
const youtube = require("scrape-youtube").default;
const cache = require("../cache");
const API_KEY = process.env.YOUTUBE_KEY;

var opts = {
  type: "video",
  maxResults: 1,
  videoCategoryId: "10",
  key: API_KEY,
};

const imageLink = (link) => {
  const newLink = link.replace("hqdefault", "default");

  return newLink;
};

const youtubeScrape = async (query) => {
  const result = await youtube.search(query);
  if (result) {
    const { title, link, thumbnail } = result.videos[0];
    const th = imageLink(thumbnail);
    let song;
    let artist;
    try {
      const info = await ytdl.getBasicInfo(link); //try to find the song title and artist from the video link
      song = info.videoDetails.media.song;
      artist = info.videoDetails.media.artist;
    } catch (e) {
      console.log("Cant find artist info");
    }
    return {
      track: song ? song : title,
      artists: artist ? artist : "",
      playerInfo: {
        link,
        title: htmlUnescape(title),
        image: th,
      },
    };
  }
};

module.exports = async (query) => {
  let songInfo = cache.get(`SearchQuery:${query}`); //check if song is present in cache

  if (!songInfo) {
    //if song is not in cahce search it using youtube-search
    try {
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

        let song;
        let artist;
        try {
          const info = await ytdl.getBasicInfo(link); //try to find the song title and artist from the video link
          song = info.videoDetails.media.song;
          artist = info.videoDetails.media.artist;
        } catch (e) {
          console.log("Cant find artist info");
        }

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
    } catch (e) {
      console.log("API rate limit exceeded.");
      try {
        songInfo = await youtubeScrape(query);
      } catch (error) {
        console.log("Invalid Query/No match found");
      }
    }
  }
  return songInfo;
};
