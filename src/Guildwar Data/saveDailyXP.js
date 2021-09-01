const { getGuildXPs } = require('./trackXP')
const fs = require('fs').promises;

const xpFileName = 'guildXP'

const main = async () => {
    const xpObject = await getGuildXPs()

    let persistentStats = await fs.readFile(`./Output/war/${xpFileName}.json`, 'utf-8');
    persistentStats = JSON.parse(persistentStats)

    persistentStats.dailyXP.guildA.push({ xp: xpObject.guildA, timeStamp: xpObject.timeStamp })
    persistentStats.dailyXP.guildB.push({ xp: xpObject.guildB, timeStamp: xpObject.timeStamp })

    await fs.writeFile(`./Output/war/${xpFileName}.json`, JSON.stringify(persistentStats))
}

main()