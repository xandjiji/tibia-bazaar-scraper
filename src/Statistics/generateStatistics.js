const Generators = require('./dataGenerators');
const fs = require('fs').promises;

const main = async () => {
    let data = await fs.readFile(`./Output/readableBazaarHistory.json`, 'utf-8');
    data = JSON.parse(data);

    let statsData = await fs.readFile(`./Output/overallStatistics.json`, 'utf-8');
    statsData = JSON.parse(statsData);

    const successAuctions = data.filter(auction => auction.hasBeenBidded);

    await fs.writeFile('./Output/overallStatistics.json', JSON.stringify({
        totalRevenue: Generators.totalRevenue(data, statsData),
        totalTibiaCoins: Generators.totalVolume(data, statsData),
        successRate: Generators.successRate(data),
        top10Bid: Generators.topBid(successAuctions),
        top10Level: Generators.topLevel(successAuctions),
        ...Generators.topSkills(successAuctions),
        vocationPercentage: Generators.vocationDistribution(data)
    }));
}

main();