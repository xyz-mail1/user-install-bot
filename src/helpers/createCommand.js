// createCommand.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchGif = require("./purr");
const db = require("../../models/test");

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
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]);

  async function execute(interaction) {
    try {
      await interaction.deferReply();
      const target = interaction.options.getUser("person");
      const gifLink = await fetchGif(apiEndpoint);

      const result = await db.findOneAndUpdate(
        { type: name, userID: target.id },
        { $inc: { count: 1 } }, // Increment the count by 1
        { new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` creates a new one if not found
      );
      const updatedCount = result.count;

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(gifLink)
        .setDescription(
          `**${
            interaction.user.displayName
          }** ${embedDescription.toLowerCase()} **${target.displayName}**
          \n-# ${target.displayName} has been fucked ${updatedCount} times!`
        );
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.log(`Error: ${err.message}`);
      await interaction.editReply(
        "An error occurred while fetching the image."
      );
    }
  }
  return { data, execute };
}

module.exports = createCommand;
