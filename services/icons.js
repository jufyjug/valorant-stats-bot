const BASE = "https://jufyjug.github.io/valorant-rank-icons/";

const rankIcons = {
    3: "Iron_1_Rank.png",
    4: "Iron_2_Rank.png",
    5: "Iron_3_Rank.png",
    6: "Bronze_1_Rank.png",
    7: "Bronze_2_Rank.png",
    8: "Bronze_3_Rank.png",
    9: "Silver_1_Rank.png",
    10: "Silver_2_Rank.png",
    11: "Silver_3_Rank.png",
    12: "Gold_1_Rank.png",
    13: "Gold_2_Rank.png",
    14: "Gold_3_Rank.png",
    15: "Platinum_1_Rank.png",
    16: "Platinum_2_Rank.png",
    17: "Platinum_3_Rank.png",
    18: "Diamond_1_Rank.png",
    19: "Diamond_2_Rank.png",
    20: "Diamond_3_Rank.png",
    21: "Ascendant_1_Rank.png",
    22: "Ascendant_2_Rank.png",
    23: "Ascendant_3_Rank.png",
    24: "Immortal_1_Rank.png",
    25: "Immortal_2_Rank.png",
    26: "Immortal_3_Rank.png",
    27: "Radiant_Rank.png"
};

function getRankIcon(tierId) {
    return BASE + (rankIcons[tierId] ?? "Unrated.png");
}

module.exports = { getRankIcon };