const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchGif = require("./fetchImage");
const db = require("../../models/test");

/**
 * Creates a Discord slash command to interact with users and track interaction counts.
 * @param {string} name - The name of the command.
 * @param {string} description - A description of what the command does.
 * @param {string} optionDescription - Description of the user option (e.g., who the interaction is with).
 * @param {string} embedDescription - Description for the embed message.
 * @param {string} apiEndpoint - The API endpoint used to fetch a gif.
 * @param {string} dbword - The word used in the count message (e.g., "hugged", "slapped").
 * @returns {Object} An object containing the data (slash command) and the execute function.
 */
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

  /**
   * Executes the command when invoked by the user.
   * @param {import('discord.js').Interaction} interaction - The interaction object provided by Discord when the command is triggered.
   * @returns {Promise<void>} A promise that resolves when the interaction response is sent.
   */
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
          }** ${embedDescription.toLowerCase()} **${
            target.displayName
          }**\n-# That's ${result.count} ${dbword} now`
        );

      await interaction.editReply({ content: `${target}`, embeds: [embed] });
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
