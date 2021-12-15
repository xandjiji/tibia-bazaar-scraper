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
}
