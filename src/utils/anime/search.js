const axios = require("axios");

module.exports = async (query) => {
  try {
    const { data } = await axios.get(
      `https://api.jikan.moe/v3/search/anime?q=${query}`
    );
    if (!data || data?.results.length === 0) return undefined;
    return data.results;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
