const GuildPageHelper = require('../Parsers/GuildPageHelper');
const CharacterPageHelper = require('../Parsers/CharacterPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('../utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

const guildHelper = new GuildPageHelper()
const characterHelper = new CharacterPageHelper()

var globalDataSize = 0;
var globalIndex = 0;

const main = async () => {
    await scrapGuild('Libertabra Pune')
    await scrapGuild('Bones Alliance')
}

const scrapGuild = async (guildName) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] guild page`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    let guildMembers = guildHelper.guildMembers()
    guildMembers = guildMembers.slice(0, 4)
    globalIndex = 0;
    globalDataSize = guildMembers.length

    const allMembersData = await promiseAllInBatches(retryWrapper, guildMembers, MAX_CONCURRENT_REQUESTS);

    const formattedGuildName = guildName.replace(' ', '')

    await fs.writeFile(`./Output/war/${formattedGuildName}Members.json`, JSON.stringify(allMembersData));
    console.log(`${timeStamp('success')} All single data saved to '${formattedGuildName}Members.json'`);
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
    const { nickname } = charObject
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);
    const encodedNickname = nickname.replace(' ', '+')
    const $ = await fetchAndLoad(`https://www.tibia.com/community/?subtopic=characters&name=${encodedNickname}`);
    globalIndex++;

    characterHelper.setHtml($)
    if (characterHelper.maintenanceCheck()) process.exit();

    return {
        ...charObject,
        deathList: characterHelper.getCharacterDeaths()
    }
}

main();