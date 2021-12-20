import { broadcast, coloredText, Timer } from 'logging'
import { fetchAllFirstPages, fetchOtherPages } from './tasks'

/* @ ToDo:
    - filtrar e buildar RareItemData
    - salvar com Data class
*/

const SCRIPT_NAME = coloredText('ScrapRareItems', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  const incompleteCollection = await fetchAllFirstPages()
  const completeCollection = await fetchOtherPages(incompleteCollection)

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main
