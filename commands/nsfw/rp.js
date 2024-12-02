const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const database = require("../../models/test");

// Constants to store URLs for easier management
const API_URLS = {
  fuck: "https://purrbot.site/api/img/nsfw/fuck/gif",
  slap: "https://api.waifu.pics/sfw/slap",
};

// Function to fetch image URL and increment count
async function fetchAndIncrementCount(url, sender, target, name) {
  try {
    const { link, url: fetchedUrl } = await (await fetch(url)).json();
    const image = url.includes("purrbot") ? link : fetchedUrl;

    const [senderID, receiverID] = [sender, target].sort();
    const model = database(name);
    const result = await model.findOneAndUpdate(
      { type: name, senderID, recieverID: receiverID },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return { image, count: result.count };
  } catch (error) {
    console.error(`Error in fetchAndIncrementCount: ${error}`);
    throw new Error("Failed to fetch image or update database");
  }
}

// Function to handle embedding and message reply
async function createResponse(interaction, target, subcommand, image, count) {
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setImage(image)
    .setDescription(
      `${interaction.user} ${subcommand}s ${target} \n-# That's ${count} ${subcommand}s now`
    );

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(subcommand)
      .setLabel(`${subcommand} back`)
      .setStyle(ButtonStyle.Success)
  );

  try {
    const reply = await interaction.editReply({
      content: `${target}`,
      embeds: [embed],
      components: [button],
    });
    return reply;
  } catch (error) {
    console.error(`Error while replying: ${error}`);
    throw new Error("Failed to send reply");
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rp")
    .setDescription("Roleplay commands")
    .addSubcommand((cmd) =>
      cmd
        .setName("fuck")
        .setDescription("Fuck someone")
        .addUserOption((u) =>
          u.setName("person").setDescription("Person to fuck").setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("slap")
        .setDescription("Slap someone")
        .addUserOption((u) =>
          u.setName("person").setDescription("Person to slap").setRequired(true)
        )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const target = interaction.options.getUser("person");

      // Get the URL based on the subcommand
      const url = API_URLS[subcommand];

      // Fetch the image and increment count in the database
      const { image, count } = await fetchAndIncrementCount(
        url,
        interaction.user.id,
        target.id,
        subcommand
      );

      // Create the response
      const reply = await createResponse(
        interaction,
        target,
        subcommand,
        image,
        count
      );

      // Wait for user interaction to "confirm" the action
      const collectorFilter = (i) => i.user.id === target.id;
      const confirmation = await reply.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (confirmation.customId === subcommand) {
        await confirmation.update({ components: [] });

        // Fetch the response again for the back action and update the message
        const { image, count } = await fetchAndIncrementCount(
          url,
          target.id,
          interaction.user.id,
          subcommand
        );
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setImage(image)
          .setDescription(
            `${target} ${subcommand}s back ${interaction.user} \n-# That's ${count} ${subcommand}s now`
          );

        await confirmation.followUp({
          content: `${interaction.user}`,
          embeds: [embed],
          components: [],
        });
      }
    } catch (error) {
      console.error(`Error in execute function: ${error}`);
      return interaction.editReply({
        content: "An error occurred",
        ephemeral: true,
      });
    }
  },
};
