const storage = require("../services/storage");

async function execute(interaction) {

    const riotId = interaction.options.getString("riot_id");

    // split Name#Tag
    const parts = riotId.split("#");

    if (parts.length !== 2) {
        return interaction.reply({
            content: "❌ Invalid format. Use Name#Tag (example: AUXcable#cool)",
            ephemeral: true
        });
    }

    const name = parts[0];
    const tag = parts[1];

    storage.setUser(interaction.user.id, name, tag);

    await interaction.reply({
        content: `✅ Linked **${name}#${tag}**`,
        ephemeral: true
    });
}

module.exports = { execute };