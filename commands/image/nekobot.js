const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fetch = require("node-fetch");
async function button() {}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("NSFW content (50% chance of working)")
    .setIntegrationTypes([0, 1])
    .setContexts([0, 1, 2])
    .addSubcommand((cmd) => cmd.setName("feet").setDescription("Feet pic"))
    .addSubcommand((cmd) => cmd.setName("hentai").setDescription("Hentai pic"))
    .addSubcommand((cmd) => cmd.setName("ass").setDescription("Ass pic"))
    .addSubcommand((cmd) => cmd.setName("pgif").setDescription("Porn gif"))
    .addSubcommand((cmd) => cmd.setName("thigh").setDescription("Thigh pic"))
    .addSubcommand((cmd) => cmd.setName("boobs").setDescription("Boobs pic"))
    .addSubcommand((cmd) => cmd.setName("pussy").setDescription("Pussy pic"))
    .addSubcommand((cmd) =>
      cmd.setName("gonewild").setDescription("Gonewild pic")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const apiUrl = `https://nekobot.xyz/api/image?type=${subcommand}`;

    try {
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("nekobot-button")
          .setLabel("Refresh")
          .setStyle(ButtonStyle.Success)
      );
      const res = await fetch(apiUrl);
      const data = await res.json();
      const embed = new EmbedBuilder()
        .setImage(data.message)
        .setColor("Random");
      await interaction.reply({ embeds: [embed], components: [button] });
    } catch (error) {
      console.error("Error:", error);
      interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
  },
};
