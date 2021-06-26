const axios = require("axios");

module.exports = async (id) => {
  try {
    const { data } = await axios.get(
      `https://udility.herokuapp.com/anime_first/${id}`
    );
    if (data?.title) {
      const { image_url } = await axios.get(
        `https://api.jikan.moe/v3/anime/${id}`
      );
      if (image_url) {
        data.image_url = image_url;
      }
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

//https://api.jikan.moe/v3/search/anime?q=${query}&status=airing
