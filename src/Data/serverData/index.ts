import fs from 'fs/promises'
import { logging } from 'utils'
import { file } from 'Constants'

/* @ ToDo: setServerData */

const getServerData = async (): Promise<ServerObject[]> => {
  logging.broadcast(
    `loading ${logging.coloredText(file.SERVER_DATA.name, 'highlight')}...`,
    'system',
  )
  const data = await fs.readFile(file.SERVER_DATA.path, 'utf-8')
  return JSON.parse(data)
}

export default { getServerData }
