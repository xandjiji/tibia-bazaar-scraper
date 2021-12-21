import { broadcast, coloredText, Timer } from 'logging'
import { fetchAllFirstPages, fetchOtherPages, buildRareItemData } from './tasks'

/* @ ToDo:
    - salvar com Data class
*/

const SCRIPT_NAME = coloredText('ScrapRareItems', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  const incompleteCollection = await fetchAllFirstPages()
  const completeCollection = await fetchOtherPages(incompleteCollection)
  const rareItemData = buildRareItemData(completeCollection)

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main
