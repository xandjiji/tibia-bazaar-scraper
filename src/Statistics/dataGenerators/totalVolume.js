const { pushAndShift } = require('./utils');

module.exports = (data, fileStatsData) => {
    const successAuctions = data.filter(auction => auction.hasBeenBidded);

    const totalTibiaCoins = successAuctions.reduce((total, auction) => total + auction.currentBid, 0);

    return {
        current: totalTibiaCoins,
        lastMonth: pushAndShift(
            totalTibiaCoins - fileStatsData.totalTibiaCoins.current,
            fileStatsData.totalTibiaCoins.lastMonth
        )
    }
}