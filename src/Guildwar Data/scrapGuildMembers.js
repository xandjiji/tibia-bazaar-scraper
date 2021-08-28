const GuildPageHelper = require('../Parsers/GuildPageHelper');
const CharacterPageHelper = require('../Parsers/CharacterPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry, hash } = require('../utils');
const { saveDeathsHashset } = require('./utils')
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

const guildHelper = new GuildPageHelper()
const characterHelper = new CharacterPageHelper()

var globalDataSize = 0;
var globalIndex = 0;

const fraggers = {}
var deathSet = new Set([]);

const formattedGuildNameA = 'Libertabra Pune'.replaceAll(' ', '')
const formattedGuildNameB = 'Bones Alliance'.replaceAll(' ', '')

const main = async () => {
    const guildA = await scrapGuild('Libertabra Pune')
    const guildB = await scrapGuild('Bones Alliance')

    const guildStatsA = guildA.map(buildMemberStats)
    const guildStatsB = guildB.map(buildMemberStats)

    const finalGuildStatsA = guildStatsA.map(updateMemberWithFrag)
    const finalGuildStatsB = guildStatsB.map(updateMemberWithFrag)

    await fs.writeFile(`./Output/war/${formattedGuildNameA}Data.json`, JSON.stringify(finalGuildStatsA));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameA}Data.json'`);

    await fs.writeFile(`./Output/war/${formattedGuildNameB}Data.json`, JSON.stringify(finalGuildStatsB));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameB}Data.json'`);

    await saveDeathsHashset(deathSet)
}

const updateMemberWithFrag = (member) => ({
    ...member,
    kills: fraggers[member.nickname] ?? 0
})

const buildMemberStats = (member) => {
    member.deathList.forEach((death) => {
        const deathHash = hash(`${member.nickname}${death.date}`)
        deathSet.add(deathHash)
        death.fraggers.forEach(addFrag)
    })

    return {
        nickname: member.nickname,
        vocation: member.vocation,
        level: member.level,
        deathCount: member.deathList.length,
        kills: 0
    }
}

const addFrag = (nickname) => {
    if (!fraggers[nickname]) {
        fraggers[nickname] = 0
    }

    fraggers[nickname] = fraggers[nickname] + 1
}

const scrapGuild = async (guildName) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] guild page`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    let guildMembers = guildHelper.guildMembers()
    /* guildMembers = guildMembers.slice(0, 4) */
    globalIndex = 0;
    globalDataSize = guildMembers.length

    return await promiseAllInBatches(retryWrapper, guildMembers, MAX_CONCURRENT_REQUESTS);
}

const guildPageUrl = (name, online = false) => {
    const url = `https://www.tibia.com/community/?subtopic=guilds&page=view&order=level_desc&GuildName=${encodeURIComponent(name)}&onlyshowonline=${+online}`
    return url
}

const fetchGuildPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);
    }, MAX_RETRIES);
}

const retryWrapper = async (charObject) => {
    return await maxRetry(async () => {
        return await scrapCharacterData(charObject);
    }, MAX_RETRIES);
}

const scrapCharacterData = async (charObject) => {
    globalIndex++;
    const { nickname } = charObject
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);
    const encodedNickname = nickname.replace(' ', '+')
    const $ = await fetchAndLoad(`https://www.tibia.com/community/?subtopic=characters&name=${encodedNickname}`);

    characterHelper.setHtml($)
    if (characterHelper.maintenanceCheck()) process.exit();

    return {
        ...charObject,
        deathList: characterHelper.getCharacterDeaths()
    }
}

main();