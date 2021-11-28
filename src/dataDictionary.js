const { quests, outfits, mounts, misc: rareAchievements } = require('./Parsers/achievements');

const sortDec = (a, b) => a - b

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
    imbuementsArray.sort(sortDec)
    minifiedData[charObjectDictionary['imbuements']] = imbuementsArray;

    const questsArray = [];
    for (const quest of charObject.quests) {
        questsArray.push(questDictionary[quest]);
    }
    questsArray.sort(sortDec)
    minifiedData[charObjectDictionary['quests']] = questsArray;

    const outfitsArray = [];
    for (const outfit of charObject.outfits) {
        outfitsArray.push(outfitDictionary[outfit]);
    }
    minifiedData[charObjectDictionary['outfits']] = outfitsArray;

    const mountsArray = [];
    for (const mount of charObject.mounts) {
        mountsArray.push(mountDictionary[mount]);
    }
    minifiedData[charObjectDictionary['mounts']] = mountsArray;

    const rareAchievementsArray = [];
    for (const achievement of charObject.rareAchievements) {
        rareAchievementsArray.push(achievementDictionary[achievement]);
    }
    minifiedData[charObjectDictionary['rareAchievements']] = rareAchievementsArray;

    return [...minifiedData];
}

const minifiedToObject = (minifiedArray) => {

    const charObject = {};
    for (const [index, item] of minifiedArray.entries()) {
        charObject[charObjectDictionary[index]] = item;
    }

    const skillObject = {};
    for (const [index, item] of charObject.skills.entries()) {
        skillObject[skillsDictionary[index]] = item;
    }
    charObject.skills = skillObject;

    const charmsArray = [];
    for (const charm of charObject.charms) {
        charmsArray.push(charmDictionary[charm]);
    }
    charObject.charms = charmsArray;

    const imbuementsArray = [];
    for (const imbuement of charObject.imbuements) {
        imbuementsArray.push(imbuementDictionary[imbuement]);
    }
    charObject.imbuements = imbuementsArray;

    const questsArray = [];
    for (const quest of charObject.quests) {
        questsArray.push(questDictionary[quest]);
    }
    charObject.quests = questsArray;

    const outfitsArray = [];
    for (const outfit of charObject.outfits) {
        outfitsArray.push(outfitDictionary[outfit]);
    }
    charObject.outfits = outfitsArray;

    const mountsArray = [];
    for (const mount of charObject.mounts) {
        mountsArray.push(mountDictionary[mount]);
    }
    charObject.mounts = mountsArray;

    const rareAchievementsArray = [];
    for (const achievement of charObject.rareAchievements) {
        rareAchievementsArray.push(achievementDictionary[achievement]);
    }
    charObject.rareAchievements = rareAchievementsArray;

    return { ...charObject };
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
    'quests',
    'outfits',
    'mounts',
    'rareAchievements'
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

const questDictionary = dictionaryFactory(Object.values(quests));
const outfitDictionary = dictionaryFactory(Object.values(outfits));
const mountDictionary = dictionaryFactory(Object.values(mounts));
const achievementDictionary = dictionaryFactory(Object.values(rareAchievements));

module.exports = {
    objectToMinified,
    minifiedToObject,
    charObjectDictionary,
    skillsDictionary,
    charmDictionary,
    imbuementDictionary,
    powerfulToReadable,
    questDictionary,
    outfitDictionary,
    mountDictionary,
    achievementDictionary
}