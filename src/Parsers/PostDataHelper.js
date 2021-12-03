class PostDataHelper {
    types = {
        items: 0,
        storeItems: 1,
        mounts: 2,
        storeMounts: 3,
        outfits: 4,
        storeOutfits: 5
    }

    setHtml($) {
        this.$ = $;
    }

    outfits(baseParser) {
        const icons = baseParser ?? this.$('.CVIcon')

        const outfits = []
        icons.each((_, element) => {
            const title = element.attribs.title
            const [name, addons] = title.split(' (')
            const [, addon1, addon2] = addons.split('&')
            const type = +!!addon1 + (+!!addon2 * 2)

            outfits.push({ name, type })
        })

        return outfits
    }

    mounts(baseParser) {
        const icons = baseParser ?? this.$('.CVIcon')

        const mounts = []
        icons.each((_, element) => {
            const name = element.attribs.title
            mounts.push(name)
        })

        return mounts
    }
}

module.exports = PostDataHelper;