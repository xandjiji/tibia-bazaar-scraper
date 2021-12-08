const { lowerCaseKeys, dictionaryFactory } = require('../utils')

const scrapingTokens = lowerCaseKeys({
    "Biodegradable": "Biodegradable",
    "Fearless": "Fearless",
    "Goldhunter": "Goldhunter",
    "His True Face": "His True Face",
    "Razing!": "Razing!",
    "The More the Merrier": "The More the Merrier",
})

const tokens = Object.values(scrapingTokens)

const dictionary = dictionaryFactory(tokens);

module.exports = { scrapingTokens, tokens, dictionary }