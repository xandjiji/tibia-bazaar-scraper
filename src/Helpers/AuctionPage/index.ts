import cheerio from 'cheerio'
import { PostData } from 'Helpers'
import { sanitizeHtmlString, parseDate, exitIfMaintenance } from 'utils'
import { ServerData } from 'Data'
import {
  quest as questDictionary,
  rareAchievement as achievementDictionary,
} from 'DataDictionary/dictionaries'
import { getVocationId, filterListTable } from '../utils'

export default class AuctionPage {
  $ = cheerio
  serverDataHelper = new ServerData()
  postHelper = new PostData()

  async loadServerData() {
    await this.serverDataHelper.load()
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
    const onClickHandler = buttonElement.attr('onclick')!
    const [, dirtyId] = onClickHandler?.split('auctionid=')
    const [stringId] = dirtyId.split('&')

    return +stringId
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
      const timestamp = timestampElement.attr('data-timestamp')!
      return +timestamp
    }

    const auctionEndElement = this.$('.ShortAuctionDataValue').next().next()
    const sanitizedDateString = sanitizeHtmlString(auctionEndElement.text())

    return parseDate(sanitizedDateString)
  }

  currentBid() {
    const currentBidText = this.$('.ShortAuctionDataValue b').text()
    return +currentBidText.replace(/,/g, '')
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
    const src = outfitElement.attr('src')!
    const [, filename] = src.split('/outfits/')
    const [outfitId] = filename.split('.')

    return outfitId
  }

  serverId() {
    const auctionServerName = this.$('.AuctionHeader a').text()
    const { serverId } =
      this.serverDataHelper.getServerByName(auctionServerName)

    return serverId
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

    return +level
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

        const skillLevel = +`${level}.${percentage.padStart(2, '0')}`

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
      const [, src] = cheerio(element).attr('src')?.split('/objects/')!

      const [itemId] = src.split('.')
      itemArray.push(+itemId)
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

  quests() {
    const { scrapingTokens } = questDictionary
    const questSet = new Set<string>([])

    const achievementsElement = this.$(
      '#Achievements .TableContentContainer tbody td',
    )

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[achievement as keyof typeof scrapingTokens]
      if (quest) {
        questSet.add(quest)
      }
    })

    const questsElement = this.$(
      '#CompletedQuestLines .TableContentContainer tbody td',
    )

    questsElement.filter(filterListTable).each((_, element) => {
      const questText = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[questText as keyof typeof scrapingTokens]
      if (quest) {
        questSet.add(quest)
      }
    })

    return [...questSet]
  }

  rareAchievements() {
    const achievementsElement = this.$(
      '#Achievements .TableContentContainer tbody td',
    )

    const { scrapingTokens } = achievementDictionary
    const achievementSet = new Set<string>([])

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const rareAchievement =
        scrapingTokens[achievement as keyof typeof scrapingTokens]
      if (rareAchievement) {
        achievementSet.add(rareAchievement)
      }
    })

    return [...achievementSet]
  }

  outfits() {
    const firstPage = this.$(`#Outfits .TableContent tbody .BlockPage .CVIcon`)
    return this.postHelper.outfits(firstPage)
  }

  storeOutfits() {
    const firstPage = this.$(
      `#StoreOutfits .TableContent tbody .BlockPage .CVIcon`,
    )
    return this.postHelper.outfits(firstPage)
  }

  mounts() {
    const firstPage = this.$(`#Mounts .TableContent tbody .BlockPage .CVIcon`)
    return this.postHelper.mounts(firstPage)
  }

  storeMounts() {
    const firstPage = this.$(
      `#StoreMounts .TableContent tbody .BlockPage .CVIcon`,
    )
    return this.postHelper.mounts(firstPage)
  }

  partialCharacterObject(): PartialCharacterObject {
    exitIfMaintenance(() => this.maintenanceCheck())

    return {
      id: this.id(),
      nickname: this.nickname(),
      auctionEnd: this.auctionEnd(),
      currentBid: this.currentBid(),
      hasBeenBidded: this.hasBeenBidded(),
      outfitId: this.outfitId(),
      serverId: this.serverId(),
      vocationId: this.vocationId(),
      sex: this.sex(),
      level: this.level(),
      skills: this.skills(),
      items: this.items(),
      charms: this.charms(),
      transfer: this.transfer(),
      imbuements: this.imbuements(),
      quests: this.quests(),
      outfits: this.outfits(),
      storeOutfits: this.storeOutfits(),
      mounts: this.mounts(),
      storeMounts: this.storeMounts(),
      rareAchievements: this.rareAchievements(),
    }
  }
}
