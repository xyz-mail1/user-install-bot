// createCommand.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchGif = require("./purr");

function createCommand(
  name,
  description,
  optionDescription,
  embedDescription,
  apiEndpoint
) {
  const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription(`The person to ${optionDescription.toLowerCase()}`)
        .setRequired(true)
    );

  async function execute(interaction) {
    try {
      const target = interaction.options.getUser("person");
      const gifLink = await fetchGif(apiEndpoint);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setImage(gifLink)
        .setDescription(
          `<@${interaction.user.id}> ${embedDescription.toLowerCase()} <@${
            target.id
          }>`
        );
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(`Error: ${err.message}`);
      await interaction.reply("An error occurred while fetching the image.");
    }
  }

  return { data, execute };
}

module.exports = createCommand;
