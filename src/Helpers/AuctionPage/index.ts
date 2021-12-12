import cheerio from 'cheerio'
import { sanitizeHtmlString, parseDate } from 'utils'
import { serverData as file } from 'Data'

export default class AuctionPage {
  $ = cheerio
  serverData: ServerObject[] = []

  async loadServerData() {
    this.serverData = await file.getServerData()
  }

  setContent(content: string) {
    this.$ = cheerio.load(content)
  }

  maintenanceCheck() {
    const headingElement = this.$('h1')
    return headingElement.text() === 'Downtime'
  }

  errorCheck() {
    const errorText = this.$('#currentcharactertrades .Text').text()
    return errorText === 'Error'
  }

  id() {
    const buttonElement = this.$(
      '.DisplayOptionsButton a.BigButtonText',
    ).first()
    const onClickHandler = buttonElement.attr('onclick') as string
    const [, dirtyId] = onClickHandler?.split('auctionid=')
    const [stringId] = dirtyId.split('&')
    return Number(stringId)
  }

  isFinished() {
    return !this.$('.MyMaxBidLabel').length
  }

  nickname() {
    return this.$('.Auction .AuctionCharacterName').text()
  }

  auctionEnd() {
    const timestampElement = this.$('.AuctionTimer')

    if (timestampElement.length) {
      const timestamp = timestampElement.attr('data-timestamp')
      return Number(timestamp)
    }

    const auctionEndElement = this.$('.ShortAuctionDataValue').next().next()
    const sanitizedDateString = sanitizeHtmlString(auctionEndElement.text())

    return parseDate(sanitizedDateString)
  }

  currentBid() {
    const currentBidText = this.$('.ShortAuctionDataValue b').text()
    const formattedBid = Number(currentBidText.replace(/,/g, ''))
    return formattedBid
  }

  hasBeenBidded() {
    const auctionStatus = this.$('.AuctionInfo').text()
    if (auctionStatus === 'cancelled') {
      return false
    }

    const bidElement = this.$('.ShortAuctionDataBidRow')
    const [bidText] = bidElement.text().split(':')

    const biddedTexts = ['Winning Bid', 'Current Bid']

    return biddedTexts.includes(bidText)
  }

  outfitId() {
    const outfitElement = this.$('.AuctionOutfitImage')
    const src = outfitElement.attr('src') as string
    const [, filename] = src.split('/outfits/')
    const [outfitId] = filename.split('.')

    return outfitId
  }

  serverId() {
    const auctionServerName = this.$('.AuctionHeader a').text()
    const server = this.serverData.find(
      ({ serverName }) => serverName === auctionServerName,
    )

    return server?.serverId ?? -1
  }
}
