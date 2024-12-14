const db = require("../../models/test");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("fdshdfgh")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("type of command to search for")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2]),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      "sixnine",
      "anal",
      "blowjob",
      "fuck",
      "pussylick",
      "spank",
      "cuddle",
      "hug",
      "kiss",
      "lick",
      "pat",
      "poke",
      "slap",
    ];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const string = interaction.options.getString("type");
      //console.log(string);

      const model = db(string);
      const topHugs = await model.find().sort({ count: -1 }).limit(10);
      const lb = await Promise.all(
        topHugs.map(async (entry, index) => {
          const sender = await interaction.client.users
            .fetch(entry.senderID)
            .catch(() => null);
          const receiver = await interaction.client.users
            .fetch(entry.recieverID)
            .catch(() => null);
          return `${index + 1}. **${sender?.displayName || "unknown"}** ➜ **${
            receiver?.displayName || "unknown"
          }**: ${entry.count} ${string}s`;
        })
      );

      const embed = new EmbedBuilder().setDescription(lb.join("\n"));
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {}
  },
};
