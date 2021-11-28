const { dictionaryFactory } = require('../utils')

const tokens = [
    'id',
    'nickname',
    'auctionEnd',
    'currentBid',
    'hasBeenBidded',
    'outfitId',
    'serverId',
    'vocationId',
    'level',
    'skills',
    'items',
    'charms',
    'transfer',
    'imbuements',
    'quests',
    'outfits',
    'mounts',
    'rareAchievements'
]

const dictionary = dictionaryFactory(tokens);

module.exports = { tokens, dictionary }