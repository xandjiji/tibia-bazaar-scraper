import fs from 'fs/promises'
import { logging } from 'utils'
import { file } from 'Constants'

/* @ ToDo: setServerData */

const getServerData = async (): Promise<ServerObject[]> => {
  logging.broadcast(
    `loading ${logging.coloredText(file.SERVER_DATA.name, 'highlight')}...`,
    'system',
  )

  try {
    const data = await fs.readFile(file.SERVER_DATA.path, 'utf-8')
    return Object.values(JSON.parse(data))
  } catch {
    logging.broadcast(
      `failed to load ${logging.coloredText(
        file.SERVER_DATA.name,
        'highlight',
      )}, initializing a new one...`,
      'fail',
    )

    const newData: ServerObject[] = []
    await fs.writeFile(file.SERVER_DATA.path, JSON.stringify({}))
    return newData
  }
}

export default { getServerData }
