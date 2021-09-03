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
            const deathTimestamp = parseDateStringToTimestamp(fullDate)

            const killers = this.$('a', element)
            const killerList = []
            killers.each((index, element) => {
                killerList.push(element.children[0].data)
            })

            deathList.push({ date: deathTimestamp, fullDate, fraggers: killerList })
        })

        return deathList
    }
}

const parseDateStringToTimestamp = (dateString) => {
    const [date, time] = dateString.split(',')
    const [, timeString, timezone] = time.split(' ')

    return +new Date(`${date}, ${timeString} GMT+2`)
}

module.exports = CharacterPageHelper;