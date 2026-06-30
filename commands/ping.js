async function execute(interaction) {

    await interaction.reply({
        content: "🏓 Pong!",
        ephemeral: true
    });

}

module.exports = {
    execute
};