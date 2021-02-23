const dictionaryFactory = (keyArray) => {
    const dictionaryObject = {
        ...keyArray
    };

    for (const [keyValue, keyItem] of keyArray.entries()) {
        dictionaryObject[keyItem] = keyValue;
    }

    return dictionaryObject;
}

const translateObjectOrArray = (variable) => {
    if (Array.isArray(variable)) {
        const newArray = [];
        for (const key of variable) {
            newArray.push(dictionary[key]);
        }
        return newArray;

    } else {
        const newObject = {};

        for (const key in variable) {
            newObject[dictionary[key]] = variable[key];
        }
        return newObject;
    }
}

const translateCharObject = (charObject) => {
    const newCharObject = translateObjectOrArray(charObject);

    newCharObject.charms = translateObjectOrArray(newCharObject.charms);
    newCharObject.skills = translateObjectOrArray(newCharObject.skills);
    for(const key of Object.keys(newCharObject.skills)) {
        newCharObject.skills[key] = translateObjectOrArray(newCharObject.skills[key]);
    }

    return newCharObject;
}

const dictionary = dictionaryFactory([
    'level',
    'percentage',
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
    'Bless',
    'src',
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
    'charms',
    'transfer',
    'imbuements',
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

module.exports = { translateCharObject, dictionary, powerfulToReadable }