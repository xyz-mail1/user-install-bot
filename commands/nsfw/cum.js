const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cum")
    .setDescription("cum")
    .addUserOption((option) =>
      option.setName("person").setDescription(`The person to cum in~`)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  /**
   * Executes the command when invoked by the user.
   * @param {import('discord.js').Interaction} interaction - The interaction object provided by Discord when the command is triggered.
   * @returns {Promise<void>} A promise that resolves when the interaction response is sent.
   */
  async execute(interaction) {
    const response = await fetch("https://purrbot.site/api/img/nsfw/cum/gif");
    if (!response.ok) {
      return console.log("Network response was not ok");
    }
    const data = await response.json();

    const target = interaction.options.getUser("person");
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.displayName} is cumming ngh~`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setColor("Random")
      .setImage(data.link);
    if (!target) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({ content: `${target}`, embeds: [embed] });
    }
  },
};
