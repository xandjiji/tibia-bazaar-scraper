import cheerio, { Element } from 'cheerio'
import { exitIfMaintenance } from 'utils'

export default class AuctionList {
  maintenanceCheck(content: string) {
    const $ = cheerio.load(content)
    const headingElement = $('h1')
    return headingElement.text() === 'Downtime'
  }

  lastPageIndex(content: string) {
    const $ = cheerio.load(content)
    try {
      const lastPageElement = $(
        '.PageNavigation .PageLink:last-child a',
      ).first()

      const href = new URL(lastPageElement.attr('href')!)
      return +href.searchParams.get('currentpage')!
    } catch {
      return -1
    }
  }

  id(element: Element) {
    const auctionLink = cheerio('.AuctionCharacterName a', element)

    const href = new URL(auctionLink.attr('href')!)
    return +href.searchParams.get('auctionid')!
  }

  hasBeenBidded(element: Element) {
    const auctionStatus = cheerio('.AuctionInfo', element).text()
    if (auctionStatus === 'cancelled') {
      return false
    }

    const bidElement = cheerio('.ShortAuctionDataBidRow', element)
    const [bidText] = bidElement.text().split(':')

    const biddedTexts = ['Winning Bid', 'Current Bid']
    return biddedTexts.includes(bidText)
  }

  currentBid(element: Element) {
    const currentBidText = cheerio('.ShortAuctionDataValue b', element).text()
    return +currentBidText.replace(/,/g, '')
  }

  auctionBlocks(content: string): AuctionBlock[] {
    const $ = cheerio.load(content)

    exitIfMaintenance(() => this.maintenanceCheck(content))

    const auctionBlocks = $('.Auction')
    const auctions: AuctionBlock[] = []
    auctionBlocks.each((_, element) => {
      auctions.push({
        id: this.id(element),
        hasBeenBidded: this.hasBeenBidded(element),
        currentBid: this.currentBid(element),
      })
    })

    return auctions
  }
}
