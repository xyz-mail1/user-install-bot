const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("_ _")
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2])
    .addSubcommand((cmd) =>
      cmd
        .setName("feet")
        .setDescription(
          "send feet pics, this command has a 50% chance of working"
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("hentai").setDescription("send a random hentai pic")
    )
    .addSubcommand((cmd) =>
      cmd.setName("ass").setDescription("send a random ass pic")
    )
    .addSubcommand((cmd) =>
      cmd.setName("pgif").setDescription("send a random porn gif")
    )
    .addSubcommand((cmd) =>
      cmd.setName("thigh").setDescription("send a random thigh pic")
    )
    .addSubcommand((cmd) =>
      cmd.setName("boobs").setDescription("send a random boobs pic")
    )
    .addSubcommand((cmd) =>
      cmd.setName("pussy").setDescription("send a random pussy pic")
    )
    .addSubcommand((cmd) =>
      cmd.setName("gonewild").setDescription("send a random gonewild pic")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let apiUrl;

    switch (subcommand) {
      case "feet":
        apiUrl = "https://nekobot.xyz/api/image?type=feet";
        break;
      case "hentai":
        apiUrl = "https://nekobot.xyz/api/image?type=hentai";
        break;
      case "ass":
        apiUrl = "https://nekobot.xyz/api/image?type=ass";
        break;
      case "pgif":
        apiUrl = "https://nekobot.xyz/api/image?type=pgif";
        break;
      case "thigh":
        apiUrl = "https://nekobot.xyz/api/image?type=thigh";
        break;
      case "boobs":
        apiUrl = "https://nekobot.xyz/api/image?type=boobs";
        break;
      case "pussy":
        apiUrl = "https://nekobot.xyz/api/image?type=pussy";
        break;
      case "gonewild":
        apiUrl = "https://nekobot.xyz/api/image?type=gonewild";
        break;
      default:
        return interaction.reply({
          content: "Invalid subcommand.",
          ephemeral: true,
        });
    }

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const embed = new EmbedBuilder()
        .setImage(data.message)
        .setColor("Random");
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log("error");
      interaction.reply({
        content: "An error occurred while running the command.",
        ephemeral: true,
      });
    }
  },
};
