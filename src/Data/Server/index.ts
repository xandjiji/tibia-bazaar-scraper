import fs from 'fs/promises'
import { logging } from 'utils'
import { file } from 'Constants'

const { broadcast, coloredText } = logging

export default class ServerData {
  serverList: ServerObject[] = []

  async load() {
    broadcast(
      `loading ${coloredText(file.SERVER_DATA.name, 'highlight')}...`,
      'system',
    )

    try {
      const data = await fs.readFile(file.SERVER_DATA.path, 'utf-8')
      this.serverList = Object.values(JSON.parse(data))
    } catch {
      broadcast(
        `failed to load ${coloredText(
          file.SERVER_DATA.name,
          'highlight',
        )}, initializing a new one...`,
        'fail',
      )

      const newData: ServerObject[] = []
      await fs.writeFile(file.SERVER_DATA.path, JSON.stringify({}))
      this.serverList = newData
    }
  }

  private async save() {
    const serverObject: Record<string, ServerObject> = {}
    this.serverList.forEach(
      (server) => (serverObject[server.serverName] = server),
    )

    if (this.serverList.length === 0) {
      broadcast(
        `WARNING! Writing empty values to ${coloredText(
          file.SERVER_DATA.name,
          'highlight',
        )}`,
        'fail',
      )
    }

    await fs.writeFile(file.SERVER_DATA.path, JSON.stringify(serverObject))
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
      `New server '${partialServer.serverName}' was registered to ${coloredText(
        file.SERVER_DATA.name,
        'highlight',
      )}`,
      'success',
    )
  }
}
