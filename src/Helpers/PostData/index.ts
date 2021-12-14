import cheerio, { Cheerio, Element } from 'cheerio'

export default class PostData {
  $ = cheerio

  normalizedName: Record<string, string> = {
    Noblewoman: 'Nobleman',
    Norsewoman: 'Norseman',
    'Retro Noblewoman': 'Retro Nobleman',
  }

  setContent(content: string) {
    this.$ = cheerio.load(content)
  }

  normalizeFemaleOutfit(name: string) {
    return this.normalizedName[name] ?? name
  }

  outfits(baseParser?: Cheerio<Element>) {
    const icons = baseParser ?? this.$('.CVIcon')

    const outfits: Outfit[] = []
    icons.each((_, element) => {
      const title = element.attribs.title
      const [name, addons] = title.split(' (')
      const type = +!!addons.includes('1') + +!!addons.includes('2') * 2

      outfits.push({ name: this.normalizeFemaleOutfit(name), type })
    })

    return outfits
  }

  mounts(baseParser?: Cheerio<Element>) {
    const icons = baseParser ?? this.$('.CVIcon')

    const mounts: string[] = []
    icons.each((_, element) => {
      const name = element.attribs.title
      mounts.push(name)
    })

    return mounts
  }
}
