require("dotenv").config();
const { getRankIcon } = require("./icons");

async function getMMR(region, name, tag) {
    const platform = "pc";

    const [mmrRes, accountRes, match1Res, match2Res, match3Res, match4Res, match5Res] = await Promise.all([
        fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20&page=1`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20&page=2`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20&page=3`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20&page=4`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        }),
        fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=20&page=5`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        })
    ]);

    if (!mmrRes.ok) throw new Error(`Henrik MMR API returned ${mmrRes.status}`);
    if (!accountRes.ok) throw new Error(`Henrik Account API returned ${accountRes.status}`);
    if (!match1Res.ok) throw new Error(`Henrik Matches API returned ${match1Res.status}`);
    if (!match2Res.ok) throw new Error(`Henrik Matches API returned ${match2Res.status}`);
    if (!match3Res.ok) throw new Error(`Henrik Matches API returned ${match3Res.status}`);
    if (!match4Res.ok) throw new Error(`Henrik Matches API returned ${match4Res.status}`);
    if (!match5Res.ok) throw new Error(`Henrik Matches API returned ${match5Res.status}`);

    const mmr = await mmrRes.json();
    const account = await accountRes.json();
    const [m1, m2, m3, m4, m5] = await Promise.all([
        match1Res.json(), match2Res.json(), match3Res.json(), match4Res.json(), match5Res.json()
    ]);

    // Calculate HS%, winrate, KD from last 20 competitive matches
    let totalKills = 0, totalDeaths = 0, totalHeadshots = 0, totalShots = 0, wins = 0, totalPlaytime = 0;

    const allMatches = [...m1.data, ...m2.data, ...m3.data, ...m4.data, ...m5.data];

    for (const match of allMatches) {
        const me = match.players.find(
            p => p.name === name && p.tag === tag
        );
        if (!me) continue;

        totalKills += me.stats.kills;
        totalDeaths += me.stats.deaths;
        totalHeadshots += me.stats.headshots;
        totalShots += me.stats.headshots + me.stats.bodyshots + me.stats.legshots;
        totalPlaytime += me.session_playtime_in_ms || 0;

        const myTeam = me.team_id.toLowerCase();
        const teamData = match.teams.find(t => t.team_id.toLowerCase() === myTeam);
        if (teamData?.won) wins++;
    }

    const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
    const headshotPercent = totalShots > 0 ? Math.round((totalHeadshots / totalShots) * 100) + "%" : "0%";
    const winRate = allMatches.length > 0 ? Math.round((wins / allMatches.length) * 100) + "%" : "0%";

    // Resolve title UUID to text
    let title = "";
    if (account.data.title) {
        const titleRes = await fetch(`https://valorant-api.com/v1/playertitles/${account.data.title}`);
        if (titleRes.ok) {
            const titleJson = await titleRes.json();
            title = titleJson.data.titleText || "";
        }
    }
    
    return {
        riotName: mmr.data.account.name,
        riotTag: mmr.data.account.tag,
        title: title || "",

        currentRank: mmr.data.current.tier.name,
        currentTierId: mmr.data.current.tier.id,
        currentRR: mmr.data.current.rr,
        currentIcon: getRankIcon(mmr.data.current.tier.id),

        peakRank: mmr.data.peak.tier.name,
        peakTierId: mmr.data.peak.tier.id,
        peakIcon: getRankIcon(mmr.data.peak.tier.id),

        kd: parseFloat(kd),
        headshotPercent,
        winRate,
        playtime: totalPlaytime
    };
}

module.exports = {
    getMMR
};