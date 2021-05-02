const { top10BySkillFactory } = require('./utils');

module.exports = (successAuctions) => {
    return {
        top10Magic: top10BySkillFactory('magic', successAuctions),
        top10Club: top10BySkillFactory('club', successAuctions),
        top10Fist: top10BySkillFactory('fist', successAuctions),
        top10Sword: top10BySkillFactory('sword', successAuctions),
        top10Fishing: top10BySkillFactory('fishing', successAuctions),
        top10Axe: top10BySkillFactory('axe', successAuctions),
        top10Distance: top10BySkillFactory('distance', successAuctions),
        top10Shielding: top10BySkillFactory('shielding', successAuctions)
    }
}