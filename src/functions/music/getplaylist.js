var SpotifyWebApi = require("spotify-web-api-node");
var cache = require("../cache.js");
const spotify_access_token = require("./spotify_access_token.js");
var spotifyApi = new SpotifyWebApi();

module.exports = async (query) => {
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
  var response = await spotifyApi.getPlaylist(query);
  //   console.log(response);

  let data = {};
  if (response.statusCode === 200) {
    const title = response.body.name;
    const owner = response.body.owner.display_name;
    const playlistimage = response.body.images[2].url;
    const playlistInfo = { title, owner, playlistimage };
    data.playlistInfo = playlistInfo;
    data.tracks = [];
    let playlist = response.body.tracks.items;
    playlist.map((tracks) => {
      const artists = tracks.track.artists.map((artist) => artist.name).join();
      const image = tracks.track.album.images[2];
      const obj = {
        track: tracks.track.name,
        artists,
        image,
      };
      data.tracks.push(obj);
    });
    return data;
  }
  return null;
  //   console.log(data);
  //     const artist = response.body.tracks.items[0].artists[0].name;
  //     // const artistsarray = response.body.tracks.items[0].artists;

  //     // const artists = artistsarray.map((artist) => {
  //     //   return artist.name;
  //     // });

  //     const track = response.body.tracks.items[0].name;
  //     const image = response.body.tracks.items[0].album.images[2].url;
  //     const search_query = `${artist} ${track}`;

  //     return {
  //       artist: artist,
  //       track: track,
  //       image: image,
  //       search_query: search_query,
  //     };
  //   }
};
