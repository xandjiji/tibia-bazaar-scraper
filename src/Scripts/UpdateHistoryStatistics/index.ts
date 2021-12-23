import { History, HistoryStatistics } from 'Data'
import { broadcast, coloredText, Timer } from 'logging'
import {
  calculateTotalRevenue,
  calculateTotalNegotiated,
  calculateSuccessRate,
  calculateTop10,
  calculateVocationDistribution,
} from './tasks'

const SCRIPT_NAME = coloredText('UpdateHistoryStatistics', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  const historyData = new History()
  await historyData.load()
  const allAuctions = historyData.getEntireHistory()

  const statisticsData = new HistoryStatistics()
  await statisticsData.load()

  const successfulAuctions = allAuctions.filter(
    ({ hasBeenBidded }) => hasBeenBidded,
  )

  await statisticsData.appendData('totalRevenue', calculateTotalRevenue(allAuctions))
  await statisticsData.appendData(
    'totalTibiaCoins',
    calculateTotalNegotiated(allAuctions),
  )

  await statisticsData.patchData({
    successRate: calculateSuccessRate(allAuctions),
    top10Bid: calculateTop10.byBid(successfulAuctions),
    top10Level: calculateTop10.byLevel(successfulAuctions),
    top10Magic: calculateTop10.byMagic(successfulAuctions),
    top10Club: calculateTop10.byClub(successfulAuctions),
    top10Fist: calculateTop10.byFist(successfulAuctions),
    top10Sword: calculateTop10.bySword(successfulAuctions),
    top10Fishing: calculateTop10.byFishing(successfulAuctions),
    top10Axe: calculateTop10.byAxe(successfulAuctions),
    top10Distance: calculateTop10.byDistance(successfulAuctions),
    top10Shielding: calculateTop10.byShielding(successfulAuctions),
    vocationPercentage: calculateVocationDistribution(allAuctions),
  })

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main
