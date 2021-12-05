class PostDataHelper {
    types = {
        items: 0,
        storeItems: 1,
        mounts: 2,
        storeMounts: 3,
        outfits: 4,
        storeOutfits: 5
    }

    readableTypes = {
        0: 'items',
        1: 'Store Items',
        2: 'Mounts',
        3: 'Store Mounts',
        4: 'Outfits',
        5: 'Store Outfits'
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
            const type = +!!addons.includes(1) + (+!!addons.includes(2) * 2)

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