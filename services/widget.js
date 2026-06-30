function buildWidget(stats, user) {
    return {
        data: {
            dynamic: [
                { type: 1, name: "User_name", value: user.riotName },
                { type: 1, name: "User_Tag", value: "#" + user.riotTag },
                { type: 1, name: "Title", value: stats.title || "" },
                { type: 1, name: "Peak", value: stats.peakRank },
                { type: 1, name: "Current", value: stats.currentRank },
                { type: 1, name: "HS%", value: stats.headshotPercent },
                { type: 1, name: "Winrate", value: stats.winRate },
                { type: 1, name: "KD", value: String(stats.kd.toFixed(2)) },
                { type: 3, name: "Current_Icon", value: { url: stats.currentIcon } },
                { type: 3, name: "Peak_Icon", value: { url: stats.peakIcon } },
                { type: 2, name: "Hours", value: stats.playtime }
            ]
        }
    };
}
module.exports = { buildWidget };