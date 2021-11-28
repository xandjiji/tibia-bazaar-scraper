const { dictionaryFactory } = require('../utils')

const tokens = [
    'magic',
    'club',
    'fist',
    'sword',
    'fishing',
    'axe',
    'distance',
    'shielding'
]

const dictionary = dictionaryFactory(tokens);

module.exports = { tokens, dictionary }