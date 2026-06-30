require("dotenv").config();

async function updateDiscordWidget(discordUserId, widgetData) {
    const url = `https://discord.com/api/v9/applications/${process.env.CLIENT_ID}/users/${discordUserId}/identities/0/profile`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `Bot ${process.env.TOKEN}`,
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)"
        },
        body: JSON.stringify(widgetData)
    });

    const responseText = await response.text();
    console.log("Discord Status:", response.status);
    console.log("Discord Response:", responseText);

    if (!response.ok) throw new Error(responseText);
}

module.exports = {
    updateDiscordWidget
};