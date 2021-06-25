var search = require("youtube-search");
const ytdl = require("discord-ytdl-core");
const { htmlUnescape } = require("escape-goat");
const youtube = require("scrape-youtube").default;
const { CacheGet, CacheSet } = require("../cache");
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
      // console.log(e);
      console.log("Cant find artist info");
      console.log(e);
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

const infoFromQuery = async (query) => {
  let songInfo = await CacheGet(`SearchQuery:${query}`, true); //check if song is present in cache

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
          // console.log(e);
          console.log("Cant find artist info");
          console.log(e);
        }

        songInfo = {
          track: song ? song : htmlUnescape(title),
          artists: artist ? artist : "",
          playerInfo: {
            link,
            title: htmlUnescape(title),
            image: thumbnail,
          },
        };

        CacheSet(`SearchQuery:${query}`, songInfo); //save the song info in cache for future quries
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

const infoFromLink = async (url) => {
  let songInfo = await CacheGet(url, true);
  if (!songInfo) {
    try {
      const info = await ytdl.getBasicInfo(url);
      if (info.videoDetails) {
        const {
          title,
          video_url: link,
          thumbnails: [{ url: image }],
        } = info.videoDetails;
        let song = info.videoDetails.media.song;
        let artist = info.videoDetails.media.artist;
        songInfo = {
          track: song ? song : htmlUnescape(title),
          artists: artist ? artist : "",
          playerInfo: {
            link,
            title: htmlUnescape(title),
            image,
          },
        };
        CacheSet(url, songInfo);
      }
    } catch (error) {
      console.log("Cant fetch songinfo from link");
    }
  }
  return songInfo;
};

module.exports = { infoFromLink, infoFromQuery };
