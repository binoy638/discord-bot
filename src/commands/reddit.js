
const Discord = require('discord.js');
const api = require('imageapi.js');

module.exports = {
    name: 'reddit',
	description: 'Get a random image from reddit',
	async execute(message, args) {
      let subreddits = [
          "memes",
          "meme",
          "funny"
      ]
      let subreddit = subreddits[Math.floor(Math.random()*(subreddits.length))];
      console.log(subreddit)

      let img = await api(subreddit)
      console.log(img)

      const Embed = new Discord.MessageEmbed()
      .setTitle('A meme from reddit')
      .setURL('https://www.google.com')
      .setColor('RANDOM')
      .setImage(img)

      message.channel.send(Embed)
	
    },
};