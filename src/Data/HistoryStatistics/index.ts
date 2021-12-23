import fs from 'fs/promises'
import { broadcast, coloredText, coloredDiff } from 'logging'
import { file } from 'Constants'
import { countObjectDiff } from 'utils'
import { EMPTY_STATISTICS } from './schema'
import { pushAndShift } from './utils'
import { PatchableData, AppendableDataKey } from './types'

const FILE_PATH = file.HISTORY_STATISTICS.path
const FILE_NAME = coloredText(file.HISTORY_STATISTICS.name, 'highlight')

export default class HistoryStatisticsData {
  private statisticsData = {} as StatisticsData

  async load() {
    broadcast(`Loading ${FILE_NAME}...`, 'system')

    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8')
      this.statisticsData = JSON.parse(data)
    } catch {
      broadcast(
        `Failed to load ${FILE_NAME}, initializing a new one...`,
        'fail',
      )

      this.statisticsData = EMPTY_STATISTICS
      await fs.writeFile(FILE_PATH, JSON.stringify(EMPTY_STATISTICS))
    }
  }

  private async save() {
    await fs.writeFile(FILE_PATH, JSON.stringify(this.statisticsData))
  }

  public async patchData(newValues: Partial<PatchableData>) {
    const previousData = { ...this.statisticsData }

    this.statisticsData = {
      ...this.statisticsData,
      ...newValues,
    }

    /* await this.save() */

    const characterInfoKeys: Array<keyof PatchableData> = [
      'top10Axe',
      'top10Bid',
      'top10Club',
      'top10Distance',
      'top10Fishing',
      'top10Fist',
      'top10Level',
      'top10Magic',
      'top10Shielding',
      'top10Sword',
    ]

    const numberValueInfoKeys: Array<keyof PatchableData> = ['successRate']

    for (const [untypedKey, value] of Object.entries(newValues)) {
      const key = untypedKey as keyof PatchableData

      if (characterInfoKeys.includes(key)) {
        const updatedCount = countObjectDiff(previousData[key], value)
        if (updatedCount > 0) {
          broadcast(
            `Patched ${coloredText(key, 'highlight')} values (${coloredDiff(
              updatedCount,
            )} diff)`,
            'success',
          )
        }
        continue
      }

      if (numberValueInfoKeys.includes(key)) {
        const previousValue = previousData[key] as number
        const valueDiff = (value as number) - previousValue
        broadcast(
          `Patched ${coloredText(key, 'highlight')} value (${coloredDiff(
            valueDiff,
          )} diff)`,
          'success',
        )
        continue
      }
    }
  }

  public async appendData(dataKey: AppendableDataKey, latestValue: number) {
    const previousSummary: MonthlySummary = this.statisticsData[dataKey]

    const latestDailyChange = latestValue - previousSummary.current

    const newSummary: MonthlySummary = {
      current: latestValue,
      lastMonth: pushAndShift(latestDailyChange, previousSummary.lastMonth),
    }

    this.statisticsData = {
      ...this.statisticsData,
      [dataKey]: newSummary,
    }

    /* await this.save() */

    /* @ ToDo: cool logging */
  }
}
