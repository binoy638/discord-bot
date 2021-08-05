const axios = require("axios");
const { baseUrl } = require("../../configs/api");

module.exports = async (id) => {
  try {
    const { data } = await axios.get(`${baseUrl}/anime/schedule/${id}`);

    return data.schedule;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//https://api.jikan.moe/v3/search/anime?q=${query}&status=airing
