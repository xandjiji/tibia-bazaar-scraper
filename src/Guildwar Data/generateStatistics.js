const GuildPageHelper = require('../Parsers/GuildPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('../utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

const guildHelper = new GuildPageHelper()

const fileNameA = 'LibertabraPuneData'
const fileNameB = 'BonesAllianceData'
const statisticsFileName = 'statistics'

const main = async () => {
    let previousStats = await fs.readFile(`./Output/war/${statisticsFileName}.json`, 'utf-8');
    previousStats = JSON.parse(previousStats)
    const { onlineCount } = previousStats

    const onlineGuildA = await scrapOnlineGuildCount('Libertabra Pune')
    const onlineGuildB = await scrapOnlineGuildCount('Bones Alliance')


    let dataGuildA = await fs.readFile(`./Output/war/${fileNameA}.json`, 'utf-8');
    dataGuildA = JSON.parse(dataGuildA)

    let dataGuildB = await fs.readFile(`./Output/war/${fileNameB}.json`, 'utf-8');
    dataGuildB = JSON.parse(dataGuildB)

    const puneScore = countDeaths(dataGuildB)
    const bonesScore = countDeaths(dataGuildA)

    const puneMostFraggers = getTop10Kills(dataGuildA)
    const bonesMostFraggers = getTop10Kills(dataGuildB)

    const puneMostFeeders = getTop10Feeders(dataGuildA)
    const bonesMostFeeders = getTop10Feeders(dataGuildB)

    const timeStamp = +new Date()

    const stats = {
        onlineCount: {
            guildA: pushAndShift({ count: onlineGuildA, timeStamp }, onlineCount.guildA),
            guildB: pushAndShift({ count: onlineGuildB, timeStamp }, onlineCount.guildB)
        },
        score: {
            guildA: puneScore,
            guildB: bonesScore
        },
        top10Kills: {
            guildA: puneMostFraggers,
            guildB: bonesMostFraggers
        },
        top10Deaths: {
            guildA: puneMostFeeders,
            guildB: bonesMostFeeders
        }
    }

    await fs.writeFile(`./Output/war/${statisticsFileName}.json`, JSON.stringify(stats))
}

main()

const countDeaths = (guildArray) => guildArray.reduce((acc, member) => acc + member.deathCount, 0)

const getTop10Kills = (guildArray) => guildArray.sort((a, b) => b.kills - a.kills).slice(0, 10)

const getTop10Feeders = (guildArray) => guildArray.sort((a, b) => b.deathCount - a.deathCount).slice(0, 10)

const pushAndShift = (item, array) => {
    const newArray = [...array];
    newArray.push(item);
    if (newArray.length > 24) newArray.shift();
    return newArray;
}

const guildPageUrl = (name, online = false) => {
    const url = `https://www.tibia.com/community/?subtopic=guilds&page=view&order=level_desc&GuildName=${encodeURIComponent(name)}&onlyshowonline=${+online}`
    return url
}

const scrapOnlineGuildCount = async (guildName) => {
    console.log(`${timeStamp('highlight')} Fetching [${guildName}] guild page`);
    const $ = await fetchGuildPage(guildPageUrl(guildName));
    guildHelper.setHtml($)
    if (guildHelper.maintenanceCheck()) process.exit();

    const guildMembers = guildHelper.guildMembers()

    return guildMembers.filter(member => member.online).length
}

const fetchGuildPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);
    }, MAX_RETRIES);
}