import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'

const AUCTIONS_FILE_PATH = file.CURRENT_AUCTIONS.path
const AUCTIONS_FILE_NAME = coloredText(file.CURRENT_AUCTIONS.name, 'highlight')

export default class CurrentAuctionsData {
  currentAuctions: PartialCharacterObject[] = []

  async load() {
    broadcast(`loading ${AUCTIONS_FILE_NAME}...`, 'system')

    try {
      const data = await fs.readFile(AUCTIONS_FILE_PATH, 'utf-8')
      this.currentAuctions = JSON.parse(data)
    } catch {
      broadcast(
        `failed to load ${AUCTIONS_FILE_NAME}, initializing a new one...`,
        'fail',
      )

      const newData: PartialCharacterObject[] = []
      await fs.writeFile(AUCTIONS_FILE_PATH, JSON.stringify([]))
      this.currentAuctions = newData
    }
  }

  private async save() {
    if (this.currentAuctions.length === 0) {
      broadcast(
        `WARNING! Writing empty values to ${AUCTIONS_FILE_NAME}`,
        'fail',
      )
    }

    this.currentAuctions = this.currentAuctions.sort(
      (a, b) => a.auctionEnd - b.auctionEnd,
    )

    await fs.writeFile(AUCTIONS_FILE_PATH, JSON.stringify(this.currentAuctions))
  }

  async updatePreviousAuctions(auctionBlocks: AuctionBlock[]) {
    const auctionBlockIds = new Set(auctionBlocks.map(({ id }) => id))
    let removedCount = 0
    let updatedCount = 0

    this.currentAuctions = this.currentAuctions
      .filter(({ id }) => {
        const finished = !auctionBlockIds.has(id)
        if (finished) removedCount++
        return !finished
      })
      .map((auction) => {
        const freshAuctionBlock = auctionBlocks.find(
          ({ id }) => id === auction.id,
        )

        if (!freshAuctionBlock) return auction

        const wasUpdated =
          auction.currentBid !== freshAuctionBlock.currentBid ||
          auction.hasBeenBidded !== freshAuctionBlock.hasBeenBidded

        if (wasUpdated) updatedCount++

        return {
          ...auction,
          currentBid: freshAuctionBlock.currentBid,
          hasBeenBidded: freshAuctionBlock.hasBeenBidded,
        }
      })

    await this.save()
    broadcast(
      `${AUCTIONS_FILE_NAME} entries were updated (${coloredText(
        removedCount,
        'highlight',
      )} removed and ${coloredText(updatedCount, 'highlight')} updated)`,
      'success',
    )
  }

  newAuctionIds(auctionBlocks: AuctionBlock[]): number[] {
    const currentAuctionIds = new Set(this.currentAuctions.map(({ id }) => id))

    return auctionBlocks
      .filter(({ id }) => !currentAuctionIds.has(id))
      .map(({ id }) => id)
  }

  async appendAuctions(newAuctions: PartialCharacterObject[]) {
    this.currentAuctions = [...this.currentAuctions, ...newAuctions]

    await this.save()
    broadcast(
      `Fresh auctions (${coloredText(
        newAuctions.length,
        'highlight',
      )} new entries) were saved to ${AUCTIONS_FILE_NAME}`,
      'success',
    )
  }
}
