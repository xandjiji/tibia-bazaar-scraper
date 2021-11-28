const {
    characterObject,
    skills,
    charm,
    imbuement,
    quest,
    outfit,
    mount,
    rareAchievement
} = require('./dictionaries')
const { sortDec } = require('./utils')

const objectToMinified = (charObject) => {

    const minifiedData = [];
    for (const attribute in charObject) {
        minifiedData[characterObject.dictionary[attribute]] = charObject[attribute];
    }


    const skillsArray = [];
    for (const skill in charObject.skills) {
        skillsArray[skills.dictionary[skill]] = charObject.skills[skill];
    }
    minifiedData[characterObject.dictionary['skills']] = skillsArray;


    minifiedData[characterObject.dictionary['charms']] = charObject.charms
        .map((item) => charm.dictionary[item])


    minifiedData[characterObject.dictionary['imbuements']] = charObject.imbuements
        .map((item) => imbuement.dictionary[item])
        .sort(sortDec)


    minifiedData[characterObject.dictionary['quests']] = charObject.quests
        .map((item) => quest.dictionary[item])
        .sort(sortDec)


    minifiedData[characterObject.dictionary['outfits']] = charObject.outfits
        .map((item) => outfit.dictionary[item])


    minifiedData[characterObject.dictionary['mounts']] = charObject.mounts
        .map((item) => mount.dictionary[item])


    minifiedData[characterObject.dictionary['rareAchievements']] = charObject.rareAchievements
        .map((item) => rareAchievement.dictionary[item])

    return [...minifiedData];
}

const minifiedToObject = (minifiedArray) => {

    const charObject = {};
    for (const [index, item] of minifiedArray.entries()) {
        charObject[characterObject.dictionary[index]] = item;
    }


    const skillObject = {};
    for (const [index, item] of charObject.skills.entries()) {
        skillObject[skills.dictionary[index]] = item;
    }
    charObject.skills = skillObject;


    charObject.charms = charObject.charms
        .map((item) => charm.dictionary[item])


    charObject.imbuements = charObject.imbuements
        .map((item) => imbuement.dictionary[item])


    charObject.quests = charObject.quests
        .map((item) => quest.dictionary[item])


    charObject.outfits = charObject.outfits
        .map((item) => outfit.dictionary[item])


    charObject.mounts = charObject.mounts
        .map((item) => mount.dictionary[item])


    charObject.rareAchievements = charObject.rareAchievements
        .map((item) => rareAchievement.dictionary[item])


    return { ...charObject };
}

module.exports = { objectToMinified, minifiedToObject }