const GuildPageHelper = require('../Parsers/GuildPageHelper');
const CharacterPageHelper = require('../Parsers/CharacterPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry, hash } = require('../utils');
const { getDeathsHashset, saveDeathsHashset } = require('./utils')
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

const guildHelper = new GuildPageHelper()
const characterHelper = new CharacterPageHelper()

var globalDataSize = 0;
var globalIndex = 0;

const newFrags = {}
var deathSet;
var persistedGuildA
var persistedGuildB

const formattedGuildNameA = 'Libertabra Pune'.replace(/ /g, '')
const formattedGuildNameB = 'Bones Alliance'.replace(/ /g, '')

const main = async () => {
    deathSet = await getDeathsHashset()
    persistedGuildA = await fs.readFile(`./Output/war/${formattedGuildNameA}Data.json`, 'utf-8');
    persistedGuildA = JSON.parse(persistedGuildA)
    persistedGuildB = await fs.readFile(`./Output/war/${formattedGuildNameB}Data.json`, 'utf-8');
    persistedGuildB = JSON.parse(persistedGuildB)


    let onlineGuildA = await scrapGuild('Libertabra Pune')
    let onlineGuildB = await scrapGuild('Bones Alliance')

    onlineGuildA = filterFriendlyFire(onlineGuildA, persistedGuildA)
    onlineGuildB = filterFriendlyFire(onlineGuildB, persistedGuildB)

    onlineGuildA.forEach(countabilizeDeath)
    onlineGuildB.forEach(countabilizeDeath)

    const updatedGuildA = updateGuild(persistedGuildA)
    const updatedGuildB = updateGuild(persistedGuildB)


    await fs.writeFile(`./Output/war/${formattedGuildNameA}Data.json`, JSON.stringify(updatedGuildA));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameA}Data.json'`);

    await fs.writeFile(`./Output/war/${formattedGuildNameB}Data.json`, JSON.stringify(updatedGuildB));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameB}Data.json'`);

    await saveDeathsHashset(deathSet)
}

const filterFriendlyFire = (guildArray, fullGuildArray) => {
    const alliedNicks = {}
    fullGuildArray.forEach((member) => alliedNicks[member.nickname] = true)

    return guildArray.map((member) => {
        const filteredDeathList = member.deathList.map((death) => ({
            ...death,
            fraggers: death.fraggers.filter((killer) => !alliedNicks[killer] === true)
        }))

        return {
            ...member,
            deathList: filteredDeathList
        }
    })
}

const updateGuild = (guildArray) => {
    const updatedGuild = [...guildArray]
    guildArray.forEach((member, index) => {
        const { nickname, level: oldLevel } = member

        const newStats = newFrags[nickname]
        if (newStats) {
            updatedGuild[index] = {
                ...member,
                deathCount: member.deathCount + newStats.deathCount,
                kills: member.kills + newStats.kills,
                level: newStats.level || oldLevel
            }
        }
    })

    return updatedGuild
}

const countabilizeDeath = (member) => {
    const { nickname, level, deathList } = member

    deathList.forEach((death) => {
        const { date, fraggers } = death
        const deathHash = hash(`${nickname}${date}`)

        if (!deathSet.has(deathHash)) {
            const currentNewFrag = newFrags[nickname]
            if (currentNewFrag) {
                newFrags[nickname] = {
                    ...currentNewFrag,
                    deathCount: currentNewFrag.deathCount + 1,
                    level
                }
            } else {
                newFrags[nickname] = {
                    deathCount: 1,
                    kills: 0,
                    level
                }
            }

            fraggers.forEach(contabilizeKillers)

            deathSet.add(deathHash)
        }
    })
}

const contabilizeKillers = (nickname) => {
    const currentNewFrag = newFrags[nickname]
    if (currentNewFrag) {
        newFrags[nickname] = {
            ...currentNewFrag,
            kills: currentNewFrag.kills + 1
        }
    } else {
        newFrags[nickname] = {
            deathCount: 0,
            kills: 1
        }
    }
}

const scrapGuild = async (guildName) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] online members`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    let guildMembers = guildHelper.guildMembers()
    guildMembers = guildMembers.filter((member) => member.online)
    /* guildMembers = guildMembers.slice(0, 20) */
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