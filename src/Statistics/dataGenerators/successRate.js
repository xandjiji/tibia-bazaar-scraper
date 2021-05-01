module.exports = (data) => {
    const successAuctions = data.filter(auction => auction.hasBeenBidded);

    const successCount = successAuctions.length;
    return (successCount / data.length * 100).toFixed(2);
}