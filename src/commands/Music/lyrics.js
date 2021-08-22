const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const musicPlayerInstance = require("../../utils/music/musicPlayerInstance");
const lyricsFinder = require("lyrics-finder");
const { ErrorEmbed } = require("../../utils/embed");
const player = require("../../utils/misc/Discordcollection");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "lyrics",
      group: "music",
      memberName: "lyrics",
      description: "Get lyrics of a song.",
      args: [
        {
          key: "title",
          prompt: "What is the title of the song?",
          type: "string",
          default: "",
        },
        {
          key: "artist",
          prompt: "Who is the artist of the song?",
          type: "string",
          default: "",
        },
      ],
    });
  }
  async run(message, args) {
    const { channel } = message;
    let { title, artist } = args;
    // if (!title || !artist) {
    //   return ErrorEmbed(
    //     "Provide both title and artist.\n`lyrics [title] [artist]`",
    //     channel
    //   );
    // }
    if (!title || !artist) {
      //   return ErrorEmbed(
      //     "No title & artist name provided. use `lyrics [title] [artist]`",
      //     channel
      //   );
      let musicPlayer = player.get(`MusicPlayer-${channel.guild.id}`);
      if (!musicPlayer) {
        return ErrorEmbed(
          "No song found.\n Either play a song or use `lyrics [title] [artist]`",
          channel
        );
      }
      const currentSong = musicPlayer.currentSong();
      const { track, artists } = currentSong;
      title = track;
      artist = artists;
    }

    let lyrics = await lyricsFinder(artist, title);
    if (!lyrics) {
      return ErrorEmbed("No lyrics found.", channel);
    }
    const embed = new Discord.MessageEmbed()
      .setDescription(`\`\`\`${lyrics}\`\`\``)
      .setTitle(`📜 ${formatString(title)} - ${formatString(artist)}`);

    channel.send(embed);
  }
};

function formatString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
