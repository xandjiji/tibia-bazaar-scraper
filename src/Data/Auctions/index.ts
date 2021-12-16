import fs from 'fs/promises'
import { logging } from 'utils'
import { file } from 'Constants'

const { broadcast, coloredText } = logging

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

    this.currentAuctions = this.currentAuctions
      .filter(({ id }) => auctionBlockIds.has(id))
      .map((auction) => {
        const freshAuctionBlock = auctionBlocks.find(
          ({ id }) => id === auction.id,
        )

        if (!freshAuctionBlock) return auction

        return {
          ...auction,
          currentBid: freshAuctionBlock.currentBid,
          hasBeenBidded: freshAuctionBlock.hasBeenBidded,
        }
      })

    await this.save()
    broadcast(
      `Current auctions from ${AUCTIONS_FILE_NAME} were updated`,
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
      )} entries) were saved to ${AUCTIONS_FILE_NAME}`,
      'success',
    )
  }
}
