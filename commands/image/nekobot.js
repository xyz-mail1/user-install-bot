const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("img")
    .setDescription("_ _")
    .addSubcommand((cmd) =>
      cmd
        .setName("feet")
        .setDescription(
          "send feet pics, this command has a 50% chance of wokring"
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "feet") {
      try {
        const res = await fetch("https://nekobot.xyz/api/image?type=feet");
        const data = await res.json();
        const url = data.message;
        const embed = new EmbedBuilder().setImage(url).setColor("Green");
        await interaction.reply({ content: url, embeds: [embed] });
      } catch (error) {
        console.log("error");
        interaction.reply({
          content: "an error occured while running the command",
          ephemeral: true,
        });
      }
    }
  },
};
