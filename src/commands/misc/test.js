const playlistSchema = require("../../schemas/playlistSchema");
const mongo = require("../../mongo");
const { Mongoose } = require("mongoose");
const Commando = require("discord.js-commando");
const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
module.exports = class AddCommand extends (
  Commando.Command
) {
  constructor(client) {
    super(client, {
      name: "test",
      group: "misc",
      memberName: "test",
      description: "test features",
      ownerOnly: true,
    });
  }
  async run(message, args) {
    const Players = new Discord.Collection();
    Players.set("Music Player - 1", {
      ChannelId: "1233",
      Songs: ["a", "b", "c"],
    });

    let p = Players.get("Music Player - 1");
    p.Songs.pop();
    console.log(Players.get("Music Player - 1"));

    // const { member } = message;

    // const newtracks = [
    //   {
    //     title: "newsong",
    //     link: "link",
    //   },
    //   { title: "song90", link: "link5" },
    // ];
    // await mongo().then(async (mongoose) => {
    //   try {
    //     const resp = await playlistSchema.updateOne(
    //       {
    //         user: member.user.id,
    //         "playlist.title": "song90",
    //       },
    //       {
    //         $set: {
    //           "playlist.$.playerInfo": {
    //             link: "test",
    //             image: "test",
    //             title: "test",
    //           },
    //         },
    //       }
    //     );
    //     console.log(resp);
    //   } finally {
    //     mongoose.connection.close();
    //   }
    // });
  }
};
