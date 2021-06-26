const axios = require("axios");

module.export = async (animeID) => {
  try {
    const { data: anime } = await axios.get(
      `https://udility.herokuapp.com/anime/${id}`
    );
    if (!anime.found) return null;
  } catch (error) {
    console.error(error);
  }
};
