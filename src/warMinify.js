const minifyGuildData = (guildArray) => guildArray.map((member) => [
    member.nickname,
    getVocationId(member.vocation),
    member.level,
    member.deathCount,
    member.kills
])

const unminifyGuildData = (minifiedGuildArray) => minifiedGuildArray.map((member) => {
    const [nickname, vocationId, level, deathCount, kills] = member

    return {
        nickname,
        vocation: getVocationString(vocationId),
        level,
        deathCount,
        kills
    }
})

const getVocationId = (vocationString) => {
    if (/knight/gi.test(vocationString)) return 1;
    if (/paladin/gi.test(vocationString)) return 2;
    if (/sorcerer/gi.test(vocationString)) return 3;
    if (/druid/gi.test(vocationString)) return 4;

    return 0;
}

const getVocationString = (vocationId) => {
    if (vocationId === 1) return "Elite Knight"
    if (vocationId === 2) return "Royal Paladin"
    if (vocationId === 3) return "Master Sorcerer"
    if (vocationId === 4) return "Elder Druid"

    return "None"
}

module.exports = {
    minifyGuildData,
    unminifyGuildData
}