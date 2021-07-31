const axios = require("axios");

module.exports = async (id) => {
  try {
    const { data } = await axios.get(
      `https://udility.herokuapp.com/anime/schedule/${id}`
    );

    return data.schedule;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//https://api.jikan.moe/v3/search/anime?q=${query}&status=airing
