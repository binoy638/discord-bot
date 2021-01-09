module.exports = {
  name: "server",
  description: "Show my current server.",
  active: false,
  cooldown: "6",
  execute(message, args) {
    message.channel.send(`This server's name is: ${message.guild.name}`);
  },
};
