module.exports = {
  name: "ping",
  description: "Ping!",
  not_active: true,
  cooldown: 5,
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
