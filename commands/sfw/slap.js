const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("slap someone")
    .addUserOption((o) =>
      o.setName("person").setDescription(`The person to slap`).setRequired(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async execute(interaction) {
    const target = interaction.options.getUser("person");
    const { url } = await (
      await fetch("https://api.waifu.pics/sfw/slap")
    ).json();

    const embed = new EmbedBuilder()
      .setDescription(`<@${interaction.user.id}> slaps <@${target.id}>`)
      .setImage(url)
      .setColor("Green");
    interaction.reply({ embeds: [embed] });
  },
};
