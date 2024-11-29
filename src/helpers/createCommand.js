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
      if (!gifLink)
        return interaction.editReply({
          content: "There was an error running the command",
          ephemeral: true,
        });
      const [senderID, receiverID] = [interaction.user.id, target.id].sort(); // sort both people's id so the direction i.e x to y || y to x doesnt matter

      const model = db(name);
      const result = await model.findOneAndUpdate(
        { type: name, senderID, recieverID: receiverID },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(gifLink)
        .setDescription(
          `**${
            interaction.user.displayName
          }** ${embedDescription.toLowerCase()} **${target.displayName}**\n-# ${
            target.displayName
          } has been ${dbword} ${result.count} times!`
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
