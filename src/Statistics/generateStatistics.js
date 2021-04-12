const fs = require('fs').promises;

const main = async () => {
    let data = await fs.readFile(`./Output/readableBazaarHistory.json`, 'utf-8');
    data = JSON.parse(data);
    const totalItems = data.length;

    const successAuctions = data.filter(auction => auction.hasBeenBidded);
    
    /* success % */
    const successCount = successAuctions.length;
    const successRate = (successCount / totalItems * 100).toFixed(2);
    console.log(successRate);

    /* total revenue */
    const totalInitialFeeCoins = data.length * 50;
    const totalSuccessFee = successAuctions.reduce((total, auction) => total + Math.floor(auction.currentBid * 0.12), 0);
    const totalRevenue = totalSuccessFee + totalInitialFeeCoins;
    console.log(totalRevenue);

    /* total negociated */
    const totalTibiaCoins = successAuctions.reduce((total, auction) => total + auction.currentBid, 0);
    console.log(totalTibiaCoins);

    /* top 10 by bid */
    const top10Bid = getTop10ByKey('currentBid', successAuctions);
    const top10BidFinal = top10Bid.map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid
        }
    })

    console.log(top10BidFinal);
}

const getTop10ByKey = (key, data) => {
    data.sort((a, b) => {
        return b[key] - a[key];
    });

    return data.slice(0, 10);
}

main();