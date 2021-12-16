import { ServerList } from 'Helpers'
import { ServerData } from 'Data'
import { logging } from 'utils'
import { fetchServerPage } from './utils'

const helper = new ServerList()
const serverData = new ServerData()

const main = async () => {
  await serverData.load()
  const currentServerNames = serverData.getServerNamesSet()

  logging.broadcast('Fetching server data...', 'neutral')
  const serverPageHtml = await fetchServerPage()

  const newServerData = helper.servers(serverPageHtml)

  newServerData.forEach((newServer) => {
    if (!currentServerNames.has(newServer.serverName)) {
      serverData.registerServer(newServer)
    }
  })
}

export default main
