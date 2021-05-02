const { getTop10ByKey } = require('./utils');

module.exports = (successAuctions) => {
    return getTop10ByKey('level', successAuctions).map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid,
            level: char.level
        }
    });
}