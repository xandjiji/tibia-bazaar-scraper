const cheerio = require('cheerio');

class GuildPageHelper {
    setHtml($) {
        this.$ = $;
    }

    maintenanceCheck() {
        const headingElement = this.$('h1');
        if (headingElement.text() === 'Downtime') {
            return true;
        } else {
            return false;
        }
    }

    guildMembers() {
        const memberRows = this.$('#guilds > div.Border_2 > div > div > div:nth-child(6) > table > tbody > tr > td > div > table > tbody > tr:nth-child(1) > td > div > table > tbody tr:not(.LabelH)')

        const memberCharacters = []
        memberRows.each((index, element) => {
            const tdArray = this.$('td', element)
            const nickname = tdArray[1].children[0].children[0].data
            const vocation = tdArray[2].children[0].data
            const level = tdArray[3].children[0].data

            memberCharacters.push({
                nickname,
                vocation,
                level,
            })
        })

        return memberCharacters.filter((character) => character.level >= 45)
    }
}

module.exports = GuildPageHelper;