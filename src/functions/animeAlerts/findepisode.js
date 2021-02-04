const axios = require("axios");
module.exports = async (id) => {
  return axios
    .get(`https://udility.herokuapp.com/anime/${id}`)
    .then((res) => {
      if (res.data["Found"] === true) {
        let data = res.data;
        return data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return null;
    });
};
