const dictionaryFactory = (keyArray) => {
    const dictionaryObject = {
        ...keyArray
    };

    for (const [keyValue, keyItem] of keyArray.entries()) {
        dictionaryObject[keyItem] = keyValue;
    }

    return dictionaryObject;
}

const objectToMinified = (charObject) => {

    const minifiedData = [];
    for (const attribute in charObject) {
        minifiedData[charObjectDictionary[attribute]] = charObject[attribute];
    }

    const skillsArray = [];
    for (const skill in charObject.skills) {
        skillsArray[skillsDictionary[skill]] = charObject.skills[skill];
    }
    minifiedData[charObjectDictionary['skills']] = skillsArray;

    const charmsArray = [];
    for (const charm of charObject.charms) {
        charmsArray.push(charmDictionary[charm]);
    }
    minifiedData[charObjectDictionary['charms']] = charmsArray;

    const imbuementsArray = [];
    for (const imbuement of charObject.imbuements) {
        imbuementsArray.push(imbuementDictionary[imbuement]);
    }
    minifiedData[charObjectDictionary['imbuements']] = imbuementsArray;

    return minifiedData;
}

const charObjectDictionary = dictionaryFactory([
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
    'hasSoulwar'
]);

const skillsDictionary = dictionaryFactory([
    'magic',
    'club',
    'fist',
    'sword',
    'fishing',
    'axe',
    'distance',
    'shielding'
]);

const charmDictionary = dictionaryFactory([
    'Dodge',
    'Wound',
    'Curse',
    'Zap',
    'Enflame',
    'Freeze',
    'Low Blow',
    'Parry',
    'Poison',
    'Divine Wrath',
    'Cripple',
    'Cleanse',
    'Adrenaline Burst',
    'Vampiric Embrace',
    'Numb',
    "Void's Call",
    'Scavenge',
    'Gut',
    'Bless'
]);

const imbuementDictionary = dictionaryFactory([
    'Critical Hit',
    'Life Leech',
    'Mana Leech',
    'Club Skill',
    'Shield Skill',
    'Axe Skill',
    'Magic Level',
    'Distance Skill',
    'Sword Skill',
    'Capacity',
    'Speed',
    'Paralize Removal',
    'Energy Damage',
    'Ice Damage',
    'Death Damage',
    'Fire Damage',
    'Earth Damage',
    'Energy Protection',
    'Holy Protection',
    'Fire Protection',
    'Death Protection',
    'Ice Protection',
    'Earth Protection'
]);

const powerfulToReadable = {
    'Powerful Strike': 'Critical Hit',
    'Powerful Vampirism': 'Life Leech',
    'Powerful Void': 'Mana Leech',
    'Powerful Bash': 'Club Skill',
    'Powerful Blockade': 'Shield Skill',
    'Powerful Chop': 'Axe Skill',
    'Powerful Epiphany': 'Magic Level',
    'Powerful Precision': 'Distance Skill',
    'Powerful Slash': 'Sword Skill',
    'Powerful Featherweight': 'Capacity',
    'Powerful Swiftness': 'Speed',
    'Powerful Vibrancy': 'Paralize Removal',
    'Powerful Electrify': 'Energy Damage',
    'Powerful Frost': 'Ice Damage',
    'Powerful Reap': 'Death Damage',
    'Powerful Scorch': 'Fire Damage',
    'Powerful Venom': 'Earth Damage',
    'Powerful Cloud Fabric': 'Energy Protection',
    'Powerful Demon Presence': 'Holy Protection',
    'Powerful Dragon Hide': 'Fire Protection',
    'Powerful Lich Shroud': 'Death Protection',
    'Powerful Quara Scale': 'Ice Protection',
    'Powerful Snake Skin': 'Earth Protection'
}

module.exports = {
    objectToMinified,
    charObjectDictionary,
    skillsDictionary,
    charmDictionary,
    imbuementDictionary,
    powerfulToReadable
}