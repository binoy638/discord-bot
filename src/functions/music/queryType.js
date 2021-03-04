/*
Search Query = 0
Spotify Playlist = 1
Youtube track  = 2 
Youtube Playlist = 3
Invalid Link = 4
*/
module.exports = (query) => {
  const urlregex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (urlregex.test(query)) {
    if (query.includes("open.spotify.com/playlist")) {
      return 1;
    } else if (query.includes("youtu.be") || query.includes("youtube")) {
      return 2;
    } else {
      return 4;
    }
  }
  return 0;
};
