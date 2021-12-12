import cheerio from 'cheerio'
import { sanitizeHtmlString, parseDate } from 'utils'

export default class AuctionPage {
  $ = cheerio

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
    console.log(Number(timestampElement.attr('data-timestamp')))

    if (timestampElement.length > 0) {
      const timestamp = timestampElement.attr('data-timestamp')
      return Number(timestamp)
    }

    const auctionEndElement = this.$('.ShortAuctionDataValue').next().next()
    const sanitizedDateString = sanitizeHtmlString(auctionEndElement.text())

    return parseDate(sanitizedDateString)
  }
}
