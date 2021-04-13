const fs = require('fs').promises;

const main = async () => {
    let data = await fs.readFile(`./Output/readableBazaarHistory.json`, 'utf-8');
    data = JSON.parse(data);
    const totalItems = data.length;

    const successAuctions = data.filter(auction => auction.hasBeenBidded);

    /* success % */
    const successCount = successAuctions.length;
    const successRate = (successCount / totalItems * 100).toFixed(2);

    /* total revenue */
    const totalInitialFeeCoins = data.length * 50;
    const totalSuccessFee = successAuctions.reduce((total, auction) => total + Math.floor(auction.currentBid * 0.12), 0);
    const totalRevenue = totalSuccessFee + totalInitialFeeCoins;

    /* total negociated */
    const totalTibiaCoins = successAuctions.reduce((total, auction) => total + auction.currentBid, 0);

    /* top 10 by bid */
    const top10Bid = getTop10ByKey('currentBid', successAuctions).map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid
        }
    });

    /* top 10 by level */
    const top10Level = getTop10ByKey('level', successAuctions).map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid,
            level: char.level
        }
    });

    /* top 10 by skills */
    const top10Magic = top10BySkillFactory('magic', successAuctions);
    const top10Club = top10BySkillFactory('club', successAuctions);
    const top10Fist = top10BySkillFactory('fist', successAuctions);
    const top10Sword = top10BySkillFactory('sword', successAuctions);
    const top10Fishing = top10BySkillFactory('fishing', successAuctions);
    const top10Axe = top10BySkillFactory('axe', successAuctions);
    const top10Distance = top10BySkillFactory('distance', successAuctions);
    const top10Shielding = top10BySkillFactory('shielding', successAuctions);

    const vocationCount = {
        rooker: 0,
        knight: 0,
        paladin: 0,
        sorcerer: 0,
        druid: 0
    }
    const keyArray = Object.keys(vocationCount);
    for (const char of data) {
        const vocation = keyArray[char.vocationId];
        vocationCount[vocation]++
    }

    const vocationPercentage = {
        rooker: (vocationCount.rooker / data.length * 100).toFixed(2),
        knight: (vocationCount.knight / data.length * 100).toFixed(2),
        paladin: (vocationCount.paladin / data.length * 100).toFixed(2),
        sorcerer: (vocationCount.sorcerer / data.length * 100).toFixed(2),
        druid: (vocationCount.druid / data.length * 100).toFixed(2)
    }


    /* updating overallStatistics.json */
    let statsData = await fs.readFile(`./Output/overallStatistics.json`, 'utf-8');
    statsData = JSON.parse(statsData);

    await fs.writeFile('./Output/overallStatistics.json', JSON.stringify({
        totalRevenue: {
            current: totalRevenue,
            lastMonth: pushAndShift(
                totalRevenue - statsData.totalRevenue.current,
                statsData.totalRevenue.lastMonth
            )
        },
        totalTibiaCoins: {
            current: totalTibiaCoins,
            lastMonth: pushAndShift(
                totalTibiaCoins - statsData.totalTibiaCoins.current + 2000,
                statsData.totalTibiaCoins.lastMonth
            )
        },
        successRate,
        top10Bid,
        top10Level,
        top10Magic,
        top10Club,
        top10Fist,
        top10Sword,
        top10Fishing,
        top10Axe,
        top10Distance,
        top10Shielding,
        vocationPercentage
    }));
}

const getTop10ByKey = (key, data) => {
    data.sort((a, b) => {
        return b[key] - a[key];
    });

    return data.slice(0, 10);
}

const getTop10BySkillKey = (key, data) => {
    data.sort((a, b) => {
        return b.skills[key] - a.skills[key];
    });

    return data.slice(0, 10);
}

const top10BySkillFactory = (key, data) => {
    return getTop10BySkillKey(key, data).map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid,
            [key]: char.skills[key]
        }
    });
}

const pushAndShift = (item, array) => {
    const newArray = [...array];
    newArray.push(item);
    if (newArray.length > 28) newArray.shift();
    return newArray;
}

main();