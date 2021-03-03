const SpotifyWebApi = require("spotify-web-api-node");
const cache = require("../../cache.js");
const token = require("./spotifyToken.js");
const spotifyApi = new SpotifyWebApi();

async function setToken() {
  let accessToken = cache.get("spotify-access-token");
  if (!accessToken) {
    const result = await token();

    if (!result) {
      return null;
    }
    accessToken = result.token;
    const ttl = result.expires_in;
    cache.set("spotify-access-token", accessToken, ttl);
  }

  spotifyApi.setAccessToken(accessToken);
}
setToken();

const playlist = async (slug) => {
  await setToken();
  const response = await spotifyApi.getPlaylist(slug);
  let data = {};
  if (response.statusCode === 200) {
    const title = response.body.name;
    const owner = response.body.owner.display_name;

    const playlistInfo = { title, owner };
    data.playlistInfo = playlistInfo;
    data.tracks = [];
    let playlist = response.body.tracks.items;
    playlist.map((tracks, index) => {
      const artists = tracks.track.artists.map((artist) => artist.name).join();

      const track = tracks.track.name;

      const obj = {
        track,
        artists,
      };
      data.tracks.push(obj);
    });
    return data;
  }
  return undefined;
};

const track = async (query) => {
  await setToken();
  const response = await spotifyApi.searchTracks(query, {
    limit: 1,
    offset: 0,
  });

  if (response.statusCode === 200) {
    if (response.body.tracks.items.length === 0) {
      return undefined;
    }

    const artist = response.body.tracks.items[0].artists[0].name;
    const track = response.body.tracks.items[0].name;
    const image = response.body.tracks.items[0].album.images[2].url;
    const search_query = `${artist} ${track}`;

    return {
      artist: artist,
      track: track,
      image: image,
      search_query: search_query,
    };
  }
  return undefined;
};

module.exports = { playlist, track };
