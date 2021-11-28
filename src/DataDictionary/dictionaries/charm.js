const { dictionaryFactory } = require('../utils')

const tokens = [
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
]

const dictionary = dictionaryFactory(tokens);

module.exports = { tokens, dictionary }