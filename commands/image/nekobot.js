const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
async function button() {}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("NSFW content (50% chance of working)")
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2])
    .addSubcommands((cmd) => [
      cmd.setName("feet").setDescription("Feet pics"),
      cmd.setName("hentai").setDescription("Hentai"),
      cmd.setName("ass").setDescription("Ass"),
      cmd.setName("pgif").setDescription("Porn gif"),
      cmd.setName("thigh").setDescription("Thighs"),
      cmd.setName("boobs").setDescription("Boobs"),
      cmd.setName("pussy").setDescription("Pussy"),
      cmd.setName("gonewild").setDescription("Gonewild"),
    ]),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const apiUrl = `https://nekobot.xyz/api/image?type=${subcommand}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const embed = new EmbedBuilder()
        .setImage(data.message)
        .setColor("Random");
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error:", error);
      interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
  },
};
