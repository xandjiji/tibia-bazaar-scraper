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

var deathSet;
var persistedGuildA
var persistedGuildB

var currentGuildA = {}
var currentGuildB = {}

var lastDeathsGuildA = []
var lastDeathsGuildB = []

const formattedGuildNameA = 'Libertabra Pune'.replace(/ /g, '')
const formattedGuildNameB = 'Bones Alliance'.replace(/ /g, '')
const warStartDate = 1629946800000 // 26 Aug 2021
const MILLISECONDS_IN_AN_HOUR = 3600000

const main = async () => {
    deathSet = await getDeathsHashset()
    persistedGuildA = await fs.readFile(`./Output/war/${formattedGuildNameA}Data.json`, 'utf-8');
    persistedGuildA = JSON.parse(persistedGuildA)
    persistedGuildB = await fs.readFile(`./Output/war/${formattedGuildNameB}Data.json`, 'utf-8');
    persistedGuildB = JSON.parse(persistedGuildB)

    let onlineGuildA = await scrapGuild('Libertabra Pune', currentGuildA)
    let onlineGuildB = await scrapGuild('Bones Alliance', currentGuildB)

    onlineGuildA = filterFriendlyFire(onlineGuildA, currentGuildA)
    onlineGuildB = filterFriendlyFire(onlineGuildB, currentGuildB)

    contabilizeDeath(onlineGuildA, currentGuildA, currentGuildB, lastDeathsGuildA)
    contabilizeDeath(onlineGuildB, currentGuildB, currentGuildA, lastDeathsGuildB)

    mergeOldData(persistedGuildA, currentGuildA)
    mergeOldData(persistedGuildB, currentGuildB)

    const newGuildArrayA = buildGuildArray(currentGuildA)
    const newGuildArrayB = buildGuildArray(currentGuildB)

    await fs.writeFile(`./Output/war/${formattedGuildNameA}Data.json`, JSON.stringify(newGuildArrayA));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameA}Data.json'`);

    await fs.writeFile(`./Output/war/${formattedGuildNameB}Data.json`, JSON.stringify(newGuildArrayB));
    console.log(`${timeStamp('success')} All guild data was saved to '${formattedGuildNameB}Data.json'`);

    await fs.writeFile(`./Output/war/lastDeaths.json`, JSON.stringify({
        guildA: lastDeathsGuildA.sort(sortBylevel),
        guildB: lastDeathsGuildB.sort(sortBylevel),
    }));
    console.log(`${timeStamp('success')} Last deaths was saved to 'lastDeaths.json'`);

    await saveDeathsHashset(deathSet)
}

const sortBylevel = (a, b) => b.level - a.level

const buildGuildArray = (currentGuild) => Object.keys(currentGuild).map((nickname) => ({
    nickname,
    level: currentGuild[nickname].level,
    vocation: currentGuild[nickname].vocation,
    kills: currentGuild[nickname].kills,
    deathCount: currentGuild[nickname].deathCount
}))

const mergeOldData = (oldGuildData, currentGuildData) => {
    oldGuildData.forEach((oldMember) => {
        const { nickname, kills, deathCount } = oldMember

        if (currentGuildData[nickname]) {
            currentGuildData[nickname].kills = currentGuildData[nickname].kills + kills
            currentGuildData[nickname].deathCount = currentGuildData[nickname].deathCount + deathCount
        }
    })
}

const contabilizeDeath = (onlineGuild, currentAlliedGuild, currentEnemyFullGuild, lastGuildDeaths) => {
    const currentTimestamp = +new Date()

    onlineGuild.forEach((member) => {
        const { nickname, level, vocation, deathList } = member

        deathList.forEach((death) => {
            const { fullDate, date, fraggers } = death

            deathSet.add(hash(`${nickname}${fullDate}`))

            fraggers.forEach((killer) => {
                if (currentEnemyFullGuild[killer] !== undefined) {
                    currentEnemyFullGuild[killer].kills = currentEnemyFullGuild[killer].kills + 1
                }
            })

            if (currentAlliedGuild[nickname]) {
                currentAlliedGuild[nickname].deathCount = currentAlliedGuild[nickname].deathCount + 1
            }

            if (currentTimestamp - date <= MILLISECONDS_IN_AN_HOUR) lastGuildDeaths.push({ nickname, level, vocation, timeStamp: date })
        })
    })
}

const filterFriendlyFire = (guildArray, alliedGuildDict) =>
    guildArray.map((member) => {
        const filteredDeathList = member.deathList.map((death) => ({
            ...death,
            fraggers: death.fraggers.filter((killer) => alliedGuildDict[killer] === undefined)
        }))

        return {
            ...member,
            deathList: filteredDeathList
        }
    })

const scrapGuild = async (guildName, currentGuildDictionary) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] online members`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    let guildMembers = guildHelper.guildMembers()
    guildMembers.forEach((member) => {
        currentGuildDictionary[member.nickname] = {
            vocation: member.vocation,
            level: member.level,
            deathCount: 0,
            kills: 0
        }
    })
    /* guildMembers = guildMembers.slice(0, 4) */
    guildMembers = guildMembers.filter((member) => member.online)
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

    let characterDeaths = characterHelper.getCharacterDeaths()

    characterDeaths = characterDeaths.filter((death) =>
        death.date >= warStartDate &&
        death.fraggers.length > 0 &&
        !deathSet.has(hash(`${charObject.nickname}${death.fullDate}`))
    )

    return {
        ...charObject,
        deathList: characterDeaths
    }
}

main();