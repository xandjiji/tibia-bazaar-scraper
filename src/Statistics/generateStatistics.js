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
}

main();