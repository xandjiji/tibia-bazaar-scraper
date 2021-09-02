class CharacterApiHelper {
    setJson(data) {
        this.data = data;
    }

    getCharacterDeaths() {
        console.log(this.data.characters)
        return this.data.characters.deaths.map((deathEntry) => ({
            date: `${deathEntry.date.date} GMT+2`,
            fraggers: deathEntry.involved
        }))
    }
}

module.exports = CharacterApiHelper;