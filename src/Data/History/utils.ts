import fs from 'fs'
import promisedFs from 'fs/promises'
import readline from 'readline'
import { TrackETA, coloredText } from 'logging'

export const printFilename = (filename: string) =>
  coloredText(filename, 'highlight')

export const getId = <T extends { id: number }>(auction: T) => auction.id

export const removeDupedIds = <T extends { id: number }>(array: T[]): T[] => {
  const idSet: Set<number> = new Set([])

  return array.filter(({ id }) => {
    const wasInSet = idSet.has(id)
    idSet.add(id)
    return !wasInSet
  })
}

export const readJsonl = async <T>(path: string): Promise<T[]> => {
  const fileStat = await promisedFs.stat(path)

  const fileStream = fs.createReadStream(path, { encoding: 'utf8' })
  const rl = readline.createInterface({ input: fileStream })
  const eta = new TrackETA(fileStat.size)

  const array: T[] = []
  for await (const line of rl) {
    const object = JSON.parse(line)
    array.push(object)

    eta.setCurrentTask(fileStream.bytesRead)
  }

  eta.setCurrentTask(fileStream.bytesRead)
  eta.finish()

  return array
}
