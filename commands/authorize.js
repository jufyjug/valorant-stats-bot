async function execute(interaction) {
    const userId = interaction.user.id;

    const url = `https://discord.com/oauth2/authorize` +
        `?client_id=${process.env.CLIENT_ID}` +
        `&response_type=token` +           // ← change from "code" to "token"
        `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
        `&scope=openid%20sdk.social_layer` +
        `&state=${userId}`;

    await interaction.reply({
        content: `🔐 Click below to authorize your Discord widget:\n${url}`,
        ephemeral: true
    });
}

module.exports = { execute };