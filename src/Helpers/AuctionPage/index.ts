import cheerio from 'cheerio'
import { PostData } from 'Helpers'
import { sanitizeHtmlString, parseDate, exitIfMaintenance } from 'utils'
import { ServerData } from 'Data'
import {
  quest as questDictionary,
  imbuement as imbuementDictionary,
  rareAchievement as achievementDictionary,
} from 'DataDictionary/dictionaries'
import { getVocationId, filterListTable } from '../utils'
import { getPagedData } from './utils'

export default class AuctionPage {
  private serverDataHelper = new ServerData()
  private postHelper = new PostData()

  async loadServerData() {
    await this.serverDataHelper.load()
  }

  maintenanceCheck(content: string) {
    const $ = cheerio.load(content)
    const headingElement = $('h1')
    return headingElement.text() === 'Downtime'
  }

  errorCheck(content: string) {
    const $ = cheerio.load(content)
    const errorText = $('#currentcharactertrades .Text').text()
    return errorText === 'Error'
  }

  id(content: string) {
    const $ = cheerio.load(content)
    const buttonElement = $('.DisplayOptionsButton a.BigButtonText').first()
    const onClickHandler = buttonElement.attr('onclick')!
    const [, dirtyId] = onClickHandler?.split('auctionid=')
    const [stringId] = dirtyId.split('&')

    return +stringId
  }

  isFinished(content: string) {
    const $ = cheerio.load(content)
    return !$('.MyMaxBidLabel').length
  }

  nickname(content: string) {
    const $ = cheerio.load(content)
    return $('.Auction .AuctionCharacterName').text()
  }

  auctionEnd(content: string) {
    const $ = cheerio.load(content)
    const timestampElement = $('.AuctionTimer')

    if (timestampElement.length) {
      const timestamp = timestampElement.attr('data-timestamp')!
      return +timestamp
    }

    const auctionEndElement = $('.ShortAuctionDataValue').next().next()
    const sanitizedDateString = sanitizeHtmlString(auctionEndElement.text())

    return parseDate(sanitizedDateString)
  }

  currentBid(content: string) {
    const $ = cheerio.load(content)
    const currentBidText = $('.ShortAuctionDataValue b').text()
    return +currentBidText.replace(/,/g, '')
  }

  hasBeenBidded(content: string) {
    const $ = cheerio.load(content)
    const auctionStatus = $('.AuctionInfo').text()
    if (auctionStatus === 'cancelled') {
      return false
    }

    const bidElement = $('.ShortAuctionDataBidRow')
    const [bidText] = bidElement.text().split(':')

    const biddedTexts = ['Winning Bid', 'Current Bid']

    return biddedTexts.includes(bidText)
  }

  outfitId(content: string) {
    const $ = cheerio.load(content)
    const outfitElement = $('.AuctionOutfitImage')
    const src = outfitElement.attr('src')!
    const [, filename] = src.split('/outfits/')
    const [outfitId] = filename.split('.')

    return outfitId
  }

  serverId(content: string) {
    const $ = cheerio.load(content)
    const auctionServerName = $('.AuctionHeader a').text()
    const { serverId } =
      this.serverDataHelper.getServerByName(auctionServerName)

    return serverId
  }

  vocationId(content: string) {
    const $ = cheerio.load(content)
    const headerText = $('.AuctionHeader').text()
    const [, vocation] = headerText.split(' | ')

    return getVocationId(vocation)
  }

  level(content: string) {
    const $ = cheerio.load(content)
    const headerText = $('.AuctionHeader').text()
    const [characterInfo] = headerText.split(' | ')
    const [, level] = characterInfo.split(': ')

    return +level
  }

  sex(content: string) {
    const $ = cheerio.load(content)
    const headerText = $('.AuctionHeader').text()
    const [, , characterInfo] = headerText.split(' | ')

    return characterInfo.toLowerCase() === 'female'
  }

  transfer(content: string) {
    const $ = cheerio.load(content)
    const transferText = $('.LabelV:contains("Regular World Transfer:")')
      .siblings('div')
      .text()

    return transferText === 'can be purchased and used immediately'
  }

  skills(content: string): CharacterSkillsObject {
    const $ = cheerio.load(content)
    const generalElement = $('#General .TableContentContainer tbody').children()

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
          .split(' %')

        const roundedPercentage = Math.round(+percentage)
          .toString()
          .padStart(2, '0')

        const skillLevel = +`${level}.${roundedPercentage}`

        skillArray.push(skillLevel)
      })

    const [axe, club, distance, fishing, fist, magic, shielding, sword] =
      skillArray

    return {
      magic,
      club,
      fist,
      sword,
      fishing,
      axe,
      distance,
      shielding,
    }
  }

  items(content: string) {
    const $ = cheerio.load(content)
    const itemImages = $('.AuctionItemsViewBox .CVIcon > img')

    const itemArray: number[] = []
    itemImages.map((_, element) => {
      const [, src] = cheerio(element).attr('src')?.split('/objects/')!

      const [itemId] = src.split('.')
      itemArray.push(+itemId)
    })

    return itemArray
  }

  imbuements(content: string) {
    const $ = cheerio.load(content)
    const imbuementElements = $('#Imbuements .TableContentContainer tbody td')

    const { scrapingTokens } = imbuementDictionary
    const imbuementArray: string[] = []
    imbuementElements.filter(filterListTable).each((_, element) => {
      const imbuement = cheerio(element).text().trim().toLowerCase()

      const imbuementName = scrapingTokens[imbuement]
      if (imbuementName) {
        imbuementArray.push(imbuementName)
      }
    })

    return imbuementArray.sort()
  }

  charms(content: string) {
    const $ = cheerio.load(content)
    const charmElements = $(
      '#Charms .TableContentContainer tbody td:last-child',
    )

    const charmArray: string[] = []
    charmElements.filter(filterListTable).each((_, element) => {
      const charm = cheerio(element).text()
      charmArray.push(charm)
    })

    return charmArray
  }

  quests(content: string) {
    const $ = cheerio.load(content)
    const { scrapingTokens } = questDictionary
    const questSet = new Set<string>([])

    const achievementsElement = $(
      '#Achievements .TableContentContainer tbody td',
    )

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[achievement]
      if (quest) {
        questSet.add(quest)
      }
    })

    const questsElement = $(
      '#CompletedQuestLines .TableContentContainer tbody td',
    )

    questsElement.filter(filterListTable).each((_, element) => {
      const questText = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[questText]
      if (quest) {
        questSet.add(quest)
      }
    })

    return [...questSet]
  }

  rareAchievements(content: string) {
    const $ = cheerio.load(content)
    const achievementsElement = $(
      '#Achievements .TableContentContainer tbody td',
    )

    const { scrapingTokens } = achievementDictionary
    const achievementSet = new Set<string>([])

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const rareAchievement = scrapingTokens[achievement]
      if (rareAchievement) {
        achievementSet.add(rareAchievement)
      }
    })

    return [...achievementSet]
  }

  outfitFirstPage(content: string) {
    const $ = cheerio.load(content)
    const firstPage = $('#Outfits .TableContent tbody .BlockPage')
    return this.postHelper.outfits(firstPage.html()!)
  }

  storeOutfitFirstPage(content: string) {
    const $ = cheerio.load(content)
    const firstPage = $('#StoreOutfits .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.outfits(html) : []
  }

  mountFirstPage(content: string) {
    const $ = cheerio.load(content)
    const firstPage = $('#Mounts .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.mounts(html) : []
  }

  storeMountFirstPage(content: string) {
    const $ = cheerio.load(content)
    const firstPage = $('#StoreMounts .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.mounts(html) : []
  }

  boxSectionLastIndex(id: string, content: string): number {
    const $ = cheerio.load(content)
    const lastPageLink = $(`#${id} .TableContent tbody .PageLink:last-child a`)

    let lastIndex = 1
    lastPageLink.each((_, element) => {
      const href = cheerio(element).attr('href') as string
      const [, lastPageIndex] = href.split('&currentpage=')
      lastIndex = +lastPageIndex
    })

    return lastIndex
  }

  async partialCharacterObject(
    content: string,
  ): Promise<PartialCharacterObject> {
    exitIfMaintenance(() => this.maintenanceCheck(content))

    return {
      id: this.id(content),
      nickname: this.nickname(content),
      auctionEnd: this.auctionEnd(content),
      currentBid: this.currentBid(content),
      hasBeenBidded: this.hasBeenBidded(content),
      outfitId: this.outfitId(content),
      serverId: this.serverId(content),
      vocationId: this.vocationId(content),
      sex: this.sex(content),
      level: this.level(content),
      skills: this.skills(content),
      items: this.items(content),
      charms: this.charms(content),
      transfer: this.transfer(content),
      imbuements: this.imbuements(content),
      quests: this.quests(content),
      ...(await getPagedData(content)),
      rareAchievements: this.rareAchievements(content),
    }
  }
}
