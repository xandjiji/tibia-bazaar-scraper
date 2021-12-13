import cheerio from 'cheerio'
import { sanitizeHtmlString, parseDate } from 'utils'
import { serverData as file } from 'Data'
import { getVocationId, filterListTable } from '../utils'

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

  vocationId() {
    const headerText = this.$('.AuctionHeader').text()
    const [, vocation] = headerText.split(' | ')

    return getVocationId(vocation)
  }

  level() {
    const headerText = this.$('.AuctionHeader').text()
    const [characterInfo] = headerText.split(' | ')
    const [, level] = characterInfo.split(': ')

    return Number(level)
  }

  sex() {
    const headerText = this.$('.AuctionHeader').text()
    const [, , characterInfo] = headerText.split(' | ')

    return characterInfo.toLowerCase() === 'female'
  }

  transfer() {
    const transferText = this.$('.LabelV:contains("Regular World Transfer:")')
      .siblings('div')
      .text()

    return transferText === 'can be purchased and used immediately'
  }

  skills(): CharacterSkillsObject {
    const generalElement = this.$(
      '#General .TableContentContainer tbody',
    ).children()

    const skillArray: number[] = []
    generalElement
      .find('.LevelColumn')
      .parent()
      .parent()
      .children()
      .each((_, element) => {
        const [, levelElement, percentageElement] = element.children

        const level = cheerio(levelElement).text()

        const [percentage] = cheerio('.PercentageString', percentageElement)
          .text()
          .split('.')

        const skillLevel = Number(`${level}.${percentage.padStart(2, '0')}`)

        skillArray.push(skillLevel)
      })

    const [axe, club, distance, fishing, fist, magic, shielding, sword] =
      skillArray

    return {
      magic,
      club,
      fist,
      sword,
      axe,
      distance,
      fishing,
      shielding,
    }
  }

  items() {
    const itemImages = this.$('.AuctionItemsViewBox img')

    const itemArray: number[] = []
    itemImages.map((_, element) => {
      const [, src] = cheerio(element)
        .attr('src')
        ?.split('/objects/') as string[]

      const [itemId] = src.split('.')
      itemArray.push(Number(itemId))
    })

    return itemArray
  }

  imbuements() {
    const imbuementElements = this.$(
      '#Imbuements .TableContentContainer tbody td',
    )

    const imbuementArray: string[] = []
    imbuementElements.filter(filterListTable).each((_, element) => {
      const imbuement = cheerio(element).text()
      imbuementArray.push(imbuement)
    })

    return imbuementArray
  }

  charms() {
    const charmElements = this.$(
      '#Charms .TableContentContainer tbody td:last-child',
    )

    const charmArray: string[] = []
    charmElements.filter(filterListTable).each((_, element) => {
      const charm = cheerio(element).text()
      charmArray.push(charm)
    })

    return charmArray
  }
}
