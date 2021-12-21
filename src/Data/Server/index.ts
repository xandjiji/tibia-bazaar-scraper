import fs from 'fs/promises'
import { broadcast, coloredText } from 'logging'
import { file } from 'Constants'

const FILE_PATH = file.SERVER_DATA.path
const FILE_NAME = coloredText(file.SERVER_DATA.name, 'highlight')

export default class ServerData {
  private serverList: ServerObject[] = []

  async load() {
    broadcast(`Loading ${FILE_NAME}...`, 'system')

    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8')
      this.serverList = Object.values(JSON.parse(data))
    } catch {
      broadcast(
        `Failed to load ${FILE_NAME}, initializing a new one...`,
        'fail',
      )

      const newData: ServerObject[] = []
      await fs.writeFile(FILE_PATH, JSON.stringify({}))
      this.serverList = newData
    }
  }

  private async save() {
    const serverObject: Record<string, ServerObject> = {}
    this.serverList.forEach(
      (server) => (serverObject[server.serverName] = server),
    )

    if (this.serverList.length === 0) {
      broadcast(`WARNING! Writing empty values to ${FILE_NAME}`, 'fail')
    }

    await fs.writeFile(FILE_PATH, JSON.stringify(serverObject))
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
      `New server '${partialServer.serverName}' was registered to ${FILE_NAME}`,
      'success',
    )
  }
}
