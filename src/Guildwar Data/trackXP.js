const GuildPageHelper = require('../Parsers/GuildPageHelper');
const { timeStamp, fetchAndLoad, maxRetry } = require('../utils');
const { MAX_RETRIES } = require('../config');

const guildHelper = new GuildPageHelper()

const main = async () => {
    const totalXPGuildA = await scrapTotalMemberXP('Libertabra Pune')
    const totalXPGuildB = await scrapTotalMemberXP('Bones Alliance')

    return {
        guildA: totalXPGuildA,
        guildB: totalXPGuildB,
        timeStamp: +new Date()
    }
}

const scrapTotalMemberXP = async (guildName) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] guild page`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    const totalCurrentXP = guildHelper.guildXP()

    return totalCurrentXP
}

const fetchGuildPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);
    }, MAX_RETRIES);
}

const guildPageUrl = (name, online = false) => {
    const url = `https://www.tibia.com/community/?subtopic=guilds&page=view&order=level_desc&GuildName=${encodeURIComponent(name)}&onlyshowonline=${+online}`
    return url
}

main()

module.exports = {
    getGuildXPs: main
}