class CharacterPageHelper {
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

    getCharacterDeaths() {
        let hasDeaths = false
        let deathTextElement;
        this.$('.Text').each((index, element) => {
            if (element.children[0].data === 'Character Deaths') {
                hasDeaths = true
                deathTextElement = element
            }
        })

        if (!hasDeaths) return []

        const deathSection = deathTextElement.parent.parent.parent

        const deathRows = this.$('tbody tbody tbody tr', deathSection)
        const deathList = []
        deathRows.each((index, element) => {
            const dateElement = element.children[0]

            let fullDate = dateElement.children[0].data
            fullDate = fullDate.replace(/ /g, ' ');
            const [dateString] = fullDate.split(',')
            const deathTimestamp = +new Date(dateString)

            const killers = this.$('a', element)
            const killerList = []
            killers.each((index, element) => {
                killerList.push(element.children[0].data)
            })

            deathList.push({ date: deathTimestamp, fraggers: killerList })
        })

        return deathList
    }
}

module.exports = CharacterPageHelper;