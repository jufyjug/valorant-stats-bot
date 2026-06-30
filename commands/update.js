const updater = require("../services/updater");

async function execute(interaction) {

    await interaction.deferReply({ flags: 64 });

    try {

        const stats = await updater.updateUser(interaction.user.id);

        await interaction.editReply(
            `✅ Widget updated!\nCurrent: ${stats.currentRank} (${stats.currentRR} RR)\nPeak: ${stats.peakRank}\nTitle: ${stats.title || "None"}\nK/D: ${stats.kd.toFixed(2)}\nHS%: ${stats.headshotPercent}\nWinrate: ${stats.winRate}`
        );

    } catch (err) {

        console.error(err);

        await interaction.editReply(`❌ ${err.message}`);

    }
}

module.exports = {
    execute
};