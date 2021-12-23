import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'
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
    this.statisticsData = {
      ...this.statisticsData,
      ...newValues,
    }

    await this.save()
    /* @ ToDo: cool logging */
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

    await this.save()

    /* @ ToDo: cool logging */
  }
}
