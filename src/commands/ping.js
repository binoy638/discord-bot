module.exports = {
  name: "ping",
  description: "Ping!",

  active: false,
  cooldown: 5,
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
