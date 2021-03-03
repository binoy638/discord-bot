var axios = require("axios");
var qs = require("qs");

module.exports = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: "client_credentials",
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
    // console.log(response.data);
    const token = response.data.access_token;
    const expires_in = response.data.expires_in;
    return { token, expires_in };
  } catch (error) {
    console.log(error);
  }
};
