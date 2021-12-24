import { broadcast, coloredText } from 'logging'
import { fetchHighlightedAuctionData, buildHighlightedAuctions } from './tasks'

const SCRIPT_NAME = coloredText('GetHighlightedAuctions', 'highlight')

const main = async () => {
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  const highlightedData = await fetchHighlightedAuctionData()
  const characterObjects = buildHighlightedAuctions(highlightedData)

  broadcast(`${SCRIPT_NAME} script routine finished`, 'success')
}

export default main
