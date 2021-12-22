import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'
import { makeRangeArray } from 'utils'
import { printFilename, getId } from './utils'
import { ScrapHistoryData } from './types'

const { SCRAP_HISTORY_DATA, HISTORY_AUCTIONS } = file

export default class CurrentAuctionsData {
  private lastScrapedId: number = 0
  private unfinishedAuctions: UnfinishedAuction[] = []
  private historyAuctions: PartialCharacterObject[] = []

  private unfinishedBuffer: UnfinishedAuction[] = []
  private finishedBuffer: PartialCharacterObject[] = []

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

  private async save() {
    if (this.historyAuctions.length === 0) {
      broadcast(
        `WARNING! Writing empty values to ${HISTORY_AUCTIONS.name}`,
        'fail',
      )
    }

    this.historyAuctions = this.historyAuctions.sort(
      (a, b) => b.auctionEnd - a.auctionEnd,
    )
    await fs.writeFile(
      HISTORY_AUCTIONS.path,
      JSON.stringify(this.historyAuctions),
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

  private appendBuffers() {
    this.historyAuctions = [...this.historyAuctions, ...this.finishedBuffer]
    this.unfinishedAuctions = [
      ...this.unfinishedAuctions,
      ...this.unfinishedBuffer,
    ]
  }

  private flushBuffers() {
    this.finishedBuffer = []
    this.unfinishedBuffer = []
  }

  private getHighestAuctionId() {
    return Math.max(
      ...this.finishedBuffer.map(getId),
      ...this.unfinishedBuffer.map(getId),
    )
  }

  async load() {
    await this.loadScrapData()
    await this.loadHistory()
  }

  public getUnscrapedIds(newHighestAuctionId: number) {
    return makeRangeArray(this.lastScrapedId + 1, newHighestAuctionId)
  }

  public appendFinishedBuffer(finishedAuction: PartialCharacterObject) {
    this.finishedBuffer.push(finishedAuction)
  }

  public appendUnfinishedBuffer(unfinishedAuction: UnfinishedAuction) {
    this.unfinishedBuffer.push(unfinishedAuction)
  }

  public async saveBuffers() {
    this.appendBuffers()
    this.lastScrapedId = this.getHighestAuctionId()
    await this.save()

    broadcast(
      `Fresh history auctions (${coloredText(
        this.finishedBuffer.length,
        'highlight',
      )} entries) were saved to ${HISTORY_AUCTIONS.name}`,
      'success',
    )
    broadcast(
      `Updated scrap history data (${coloredText(
        this.unfinishedBuffer.length,
        'highlight',
      )} new entries) were saved to ${SCRAP_HISTORY_DATA.name}`,
      'success',
    )

    this.flushBuffers()
  }
}
