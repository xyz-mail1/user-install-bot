const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("hug someone")
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription("The person to hug")
        .setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser("person");
      const response = await fetch("https://purrbot.site/api/img/sfw/hug/gif");
      const data = await response.json();

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setImage(data.link)
        .setDescription(`<@${interaction.user.id}> hugs <@${target.id}>`);
      interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  },
};
