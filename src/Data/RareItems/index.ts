import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'

const FILE_PATH = file.RARE_ITEM_DATA.path
const FILE_NAME = coloredText(file.RARE_ITEM_DATA.name, 'highlight')

export default class RareItemsData {
  private itemData: RareItemData = {}

  async load() {
    broadcast(`loading ${FILE_NAME}...`, 'system')

    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8')
      this.itemData = JSON.parse(data)
    } catch {
      broadcast(
        `failed to load ${FILE_NAME}, initializing a new one...`,
        'fail',
      )

      await fs.writeFile(FILE_PATH, JSON.stringify(this.itemData))
    }
  }

  private async save() {
    const rareItemData: RareItemData = {}

    Object.keys(this.itemData).forEach((itemName) => {
      const ids = this.itemData[itemName]
      if (ids.length > 0) {
        rareItemData[itemName] = ids
      }
    })

    await fs.writeFile(FILE_PATH, JSON.stringify(rareItemData))
  }

  async saveItemCollection(collection: RareItemBlockCollection) {
    const rareItemData: RareItemData = {}
    Object.values(collection).forEach(({ name, ids }) => {
      rareItemData[name] = ids
    })

    await this.save()
    broadcast(`Fresh rare item data was saved to ${FILE_NAME}`, 'success')
  }
}
