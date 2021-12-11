import cheerio from 'cheerio'

export default class AuctionPage {
  $ = cheerio

  setContent(content: string) {
    this.$.load(content)
  }

  nickname() {
    return this.$('.Auction .AuctionCharacterName').text()
  }
}
