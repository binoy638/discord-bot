const axios = require("axios");

module.exports = async (query) => {
  return axios
    .get(`https://api.jikan.moe/v3/search/anime?q=${query}&status=airing`)
    .then((res) => {
      let data = res.data.results[0];
      //   console.log("here");
      return data;
      //   return result;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return null;
    });
};
