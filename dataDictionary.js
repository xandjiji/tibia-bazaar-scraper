const dictionaryFactory = (keyArray) => {
    const dictionaryObject = {
        ...keyArray
    };

    for (const [keyValue, keyItem] of keyArray.entries()) {
        dictionaryObject[keyItem] = keyValue;
    }

    return dictionaryObject;
}

const charmDictionary = dictionaryFactory([
    'Wound',
    'Enflame',
    'Poison',
    'Freeze',
    'Zap',
    'Curse',
    'Cripple',
    'Parry',
    'Dodge',
    'Adrenaline Burst',
    'Numb',
    'Cleanse',
    'Bless',
    'Scavenge',
    'Gut',
    'Low Blow'
]);

const characterDictionary = dictionaryFactory([
    'level',
    'percentage',
    'name',
    'src',
    'amount',
    'id',
    'nickname',
    'auctionEnd',
    'currentBid',
    'hasBeenBidded',
    'outfitId',
    'serverId',
    'vocationId',
    'skills',
    'magic',
    'club',
    'fist',
    'sword',
    'fishing',
    'axe',
    'distance',
    'shielding',
    'items',
    'charms'
]);

module.exports = { charmDictionary, characterDictionary };