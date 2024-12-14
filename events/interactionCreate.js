const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("button-")) {
        const subcommand = interaction.customId.split("-")[1];

        const apiUrl = `https://nekobot.xyz/api/image?type=${subcommand}`;
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`button-${subcommand}`)
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🔄")
        );
        const res = await fetch(apiUrl);
        const data = await res.json();
        const embed = new EmbedBuilder()
          .setImage(data.message)
          .setColor("Random");
        try {
          await interaction.update({
            embeds: [embed],
            components: [button],
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {}
  },
};
