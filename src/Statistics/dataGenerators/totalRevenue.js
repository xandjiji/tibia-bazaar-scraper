const { pushAndShift } = require('./utils');

module.exports = (data, fileStatsData) => {
    const successAuctions = data.filter(auction => auction.hasBeenBidded);

    const totalInitialFeeCoins = data.length * 50;
    const totalSuccessFee = successAuctions.reduce((total, auction) => total + Math.floor(auction.currentBid * 0.12), 0);
    const totalRevenue = totalSuccessFee + totalInitialFeeCoins;

    return {
        current: totalRevenue,
        lastMonth: pushAndShift(
            totalRevenue - fileStatsData.totalRevenue.current,
            fileStatsData.totalRevenue.lastMonth
        )
    }
}