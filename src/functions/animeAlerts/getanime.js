const axios = require("axios");

module.exports = async (id) => {
  return axios
    .get(`https://udility.herokuapp.com/anime_first/${id}`)
    .then((res) => {
      if (res.data["title"]) {
        return res.data;
      } else {
        message.channel.send("Episode not found");
        return null;
      }
    })
    .catch((err) => {
      console.error("Sever error 500");
      return null;
    });
};
