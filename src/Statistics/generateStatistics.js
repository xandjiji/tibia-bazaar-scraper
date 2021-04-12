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
}

main();