// createCommand.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchGif = require("./fetchImage");
const db = require("../../models/test");

function createCommand(
  name,
  description,
  optionDescription,
  embedDescription,
  apiEndpoint,
  dbword
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

      // Sort the sender and receiver IDs to ensure the same entry for both directions
      const senderID = interaction.user.id;
      const receiverID = target.id;

      // Sort IDs alphabetically or numerically to make sure the pair is consistent
      const [sortedSenderID, sortedReceiverID] = [senderID, receiverID].sort();

      const model = db(name); // Dynamically choose model based on command name
      const result = await model.findOneAndUpdate(
        { type: name, senderID: sortedSenderID, recieverID: sortedReceiverID },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      const updatedCount = result.count;

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(gifLink)
        .setDescription(
          `**${
            interaction.user.displayName
          }** ${embedDescription.toLowerCase()} **${target.displayName}**\n-# ${
            target.displayName
          } has been ${dbword} ${updatedCount} times!`
        );

      const msg = await interaction.editReply({ embeds: [embed] });
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
