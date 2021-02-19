var SpotifyWebApi = require("spotify-web-api-node");
var cache = require("../cache.js");
const search = require("./search.js");
const spotify_access_token = require("./spotify_access_token.js");
var spotifyApi = new SpotifyWebApi();

module.exports = async (slug) => {
  let accessToken = cache.get("spotify-access-token");
  if (!accessToken) {
    const result = await spotify_access_token();

    if (!result) {
      return null;
    }
    accessToken = result.token;
    const ttl = result.expires_in;
    cache.set("spotify-access-token", accessToken, ttl);
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getPlaylist(slug);

    let data = {};
    if (response.statusCode === 200) {
      const title = response.body.name;
      const owner = response.body.owner.display_name;
      // const playlistimage = response.body.images[2].url;
      const playlistInfo = { title, owner };
      data.playlistInfo = playlistInfo;
      data.tracks = [];
      let playlist = response.body.tracks.items;
      playlist.map((tracks, index) => {
        const artists = tracks.track.artists
          .map((artist) => artist.name)
          .join();
        // const image = tracks.track.album.images[2];
        const track = tracks.track.name;

        const obj = {
          track,
          artists,
          // playerInfo,
          // source: "spotify",
          // image,
        };
        data.tracks.push(obj);
      });
      return data;
    }

    return null;
  } catch (error) {
    console.log("Invalid playlist id");
  }
};
