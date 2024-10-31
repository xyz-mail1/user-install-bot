const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick someone")
    .addUserOption((o) =>
      o.setName("person").setDescription(`The person to kick`).setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    const target = interaction.options.getUser("person");
    const { url } = await (
      await fetch("https://api.waifu.pics/sfw/kick")
    ).json();

    const embed = new EmbedBuilder()
      .setDescription(`<@${interaction.user.id}> kicks <@${target.id}>`)
      .setImage(url)
      .setColor("Green");
    interaction.reply({ embeds: [embed] });
  },
};
