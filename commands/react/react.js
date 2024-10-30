const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("react")
    .setDescription("react")
    .addSubcommand((s) => s.setName("blush").setDescription("😳 *blushes*")),
  async execute(interaction) {},
};
