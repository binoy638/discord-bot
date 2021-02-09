const play = require("../music/play");

module.exports = (data, channel, connection) => {
  const intent = data.intents[0];
  if (intent.name === "wit$play_music") {
    const query = data.entities["track:title"][0].value;
    play(channel, connection, query);
  } else if (intent.name === "wit$pause_music") {
    connection.dispatcher.pause();
  } else if (intent.name === "wit$resume_music") {
    connection.dispatcher.resume();
    connection.dispatcher.pause();
    connection.dispatcher.resume();
  }
};
