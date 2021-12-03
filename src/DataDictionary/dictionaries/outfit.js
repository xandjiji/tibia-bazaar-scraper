const { lowerCaseKeys, dictionaryFactory } = require('../utils')

const scrapingTokens = lowerCaseKeys({
    "Inquisition's Arm": "Hand of the Inquisition",
    "Exemplary Citizen": "Citzen",
    "Hunting with Style": "Hunter",
    "In Shining Armor": "Knight",
    "Of Wolves and Bears": "Druid",
    "Bane of the Hive": "Insectoid",
    "Exalted Battle Mage": "Battle Mage",
    Aristocrat: "Nobleman",
    "Beak Doctor": "Afflicted",
    "Brutal Politeness": "Barbarian",
    "Cave Completionist": "Cave Explorer",
    "Citizen of Issavi": "Citzen of Issavi",
    "Cobbled and Patched": "Makeshift Warrior",
    "Crystal Clear": "Crystal Warlord",
    Demonbane: "Demon Hunter",
    "Dream Warden": "Dream Warden",
    "Dream Warrior": "Dream Warrior",
    Falconer: "Falconer",
    "Fool at Heart": "Jester",
    Funghitastic: "Soil Guardian",
    "Glooth Engineer": "Glooth Engineer",
    "Honorary Rascoohan": "Rascoohan",
    "Life on the Streets": "Beggar",
    "Mainstreet Nightmare": "Poltergeist",
    "Master of War": "Warmaster",
    "Nightmare Walker": "Nightmare",
    "One Thousand and One": "Oriental",
    "Out in the Snowstorm": "Norseman",
    Peazzekeeper: "Wayfarer",
    "Raider in the Dark": "Percht Raider",
    "Reason to Celebrate": "Festive",
    "Rift Warrior": "Rift Warrior",
    Ritualist: "Summoner",
    "Skull and Bones": "Brotherhood of Bones",
    "Spolium Profundis": "Deepling",
    Swashbuckler: "Pirate",
    "Swift Death": "Assassin",
    Traditionalist: "Orcsoberfest Garb",
    "True Dedication": "Demon",
    "Unleash the Beast": "Revenant",
    Warlock: "Wizard",
    "Way of the Shaman": "Shaman",
    "Widely Travelled": "Discoverer",
    "Wild Warrior": "Warrior",
    Alumni: "Mage",
    "Mystic Fabric Magic": "Elementalist",
})

const tokens = Object.values(scrapingTokens)

const dictionary = dictionaryFactory(tokens);

module.exports = { scrapingTokens, tokens, dictionary }