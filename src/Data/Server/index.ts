import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'

const SERVER_FILE_PATH = file.SERVER_DATA.path
const SERVER_FILE_NAME = coloredText(file.SERVER_DATA.name, 'highlight')

export default class ServerData {
  serverList: ServerObject[] = []

  async load() {
    broadcast(`loading ${SERVER_FILE_NAME}...`, 'system')

    try {
      const data = await fs.readFile(SERVER_FILE_PATH, 'utf-8')
      this.serverList = Object.values(JSON.parse(data))
    } catch {
      broadcast(
        `failed to load ${SERVER_FILE_NAME}, initializing a new one...`,
        'fail',
      )

      const newData: ServerObject[] = []
      await fs.writeFile(SERVER_FILE_PATH, JSON.stringify({}))
      this.serverList = newData
    }
  }

  private async save() {
    const serverObject: Record<string, ServerObject> = {}
    this.serverList.forEach(
      (server) => (serverObject[server.serverName] = server),
    )

    if (this.serverList.length === 0) {
      broadcast(`WARNING! Writing empty values to ${SERVER_FILE_NAME}`, 'fail')
    }

    await fs.writeFile(SERVER_FILE_PATH, JSON.stringify(serverObject))
  }

  getAllServers(): ServerObject[] {
    return this.serverList
  }

  getServerNamesSet(): Set<string> {
    const names = this.serverList.map(({ serverName }) => serverName)
    return new Set(names)
  }

  getServerByName(name: string): ServerObject {
    const foundServer = this.serverList.find(
      ({ serverName }) => serverName === name,
    )

    if (!foundServer) throw `Unknown server name: ${name}`

    return foundServer
  }

  async registerServer(partialServer: PartialServerObject) {
    const newId = this.serverList.length
    this.serverList.push({
      ...partialServer,
      serverId: newId,
    })

    await this.save()
    broadcast(
      `New server '${partialServer.serverName}' was registered to ${SERVER_FILE_NAME}`,
      'success',
    )
  }
}
