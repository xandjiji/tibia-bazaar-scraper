import cheerio, { Element } from 'cheerio'
import { exitIfMaintenance } from 'utils'
import { buildServerLocation, buildPvpType } from './utils'
import { PartialServerObject } from './types'

export default class ServerList {
  $ = cheerio

  setContent(content: string) {
    this.$ = cheerio.load(content)
  }

  maintenanceCheck() {
    const headingElement = this.$('h1')
    return headingElement.text() === 'Downtime'
  }

  name(element: Element) {
    return cheerio('td:nth-child(1)', element).text()
  }

  location(element: Element) {
    const locationText = cheerio('td:nth-child(3)', element).text()
    return buildServerLocation(locationText)
  }

  pvpType(element: Element) {
    const pvpTypeText = cheerio('td:nth-child(4)', element).text()
    return buildPvpType(pvpTypeText)
  }

  battleye(element: Element) {
    const battleyeImageSrc = cheerio('td:nth-child(5) img', element).attr('src')

    if (!battleyeImageSrc) {
      return false
    }

    const BATTLEYE_PROTECTED_URL =
      'https://static.tibia.com/images/global/content/icon_battleyeinitial.gif'

    return battleyeImageSrc === BATTLEYE_PROTECTED_URL
  }

  experimental(element: Element) {
    const serverInfoText = cheerio('td:nth-child(6)', element)
      .text()
      .toLowerCase()

    return serverInfoText.includes('experimental')
  }

  servers(): PartialServerObject[] {
    exitIfMaintenance(() => this.maintenanceCheck())

    const serverElements = this.$('.Odd, .Even')
    const serverArray: PartialServerObject[] = []
    serverElements.each((_, element) => {
      serverArray.push({
        serverName: this.name(element),
        serverLocation: this.location(element),
        pvpType: this.pvpType(element),
        battleye: this.battleye(element),
        experimental: this.experimental(element),
      })
    })

    return serverArray
  }
}
