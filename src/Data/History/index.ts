import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'
import { printFilename } from './utils'
import { UnfinishedAuction, ScrapHistoryData } from './types'

const { SCRAP_HISTORY_DATA, HISTORY_AUCTIONS } = file

export default class CurrentAuctionsData {
  private lastScrapedId: number = 0
  private unfinishedAuctions: UnfinishedAuction[] = []
  private historyAuctions: PartialCharacterObject[] = []

  private async loadScrapData() {
    broadcast(`Loading ${printFilename(SCRAP_HISTORY_DATA.name)}...`, 'system')
    try {
      const data = await fs.readFile(SCRAP_HISTORY_DATA.path, 'utf-8')
      const { lastScrapedId, unfinishedAuctions }: ScrapHistoryData =
        JSON.parse(data)

      this.lastScrapedId = lastScrapedId
      this.unfinishedAuctions = unfinishedAuctions
    } catch {
      broadcast(
        `Failed to load ${printFilename(
          SCRAP_HISTORY_DATA.name,
        )}, initializing a new one...`,
        'fail',
      )

      const scrapHistoryData: ScrapHistoryData = {
        lastScrapedId: this.lastScrapedId,
        unfinishedAuctions: this.unfinishedAuctions,
      }
      await fs.writeFile(
        SCRAP_HISTORY_DATA.path,
        JSON.stringify(scrapHistoryData),
      )
    }
  }

  private async loadHistory() {
    broadcast(`Loading ${printFilename(HISTORY_AUCTIONS.name)}...`, 'system')
    try {
      const data = await fs.readFile(HISTORY_AUCTIONS.path, 'utf-8')
      this.historyAuctions = JSON.parse(data)
    } catch {
      broadcast(
        `Failed to load ${printFilename(
          HISTORY_AUCTIONS.name,
        )}, initializing a new one...`,
        'fail',
      )
      await fs.writeFile(HISTORY_AUCTIONS.path, JSON.stringify([]))
    }
  }

  async load() {
    await this.loadScrapData()
    await this.loadHistory()
  }

  public getLastScrapedId() {
    return this.lastScrapedId
  }
}
