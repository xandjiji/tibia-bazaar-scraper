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

const TASK_UPDATE_INTERVAL = 1000

export const readJsonl = async <T>(path: string): Promise<T[]> => {
  const fileStat = await promisedFs.stat(path)

  const fileStream = fs.createReadStream(path, { encoding: 'utf8' })
  const rl = readline.createInterface({ input: fileStream })
  const eta = new TrackETA(fileStat.size)

  const updater = setInterval(
    () => eta.setCurrentTask(fileStream.bytesRead),
    TASK_UPDATE_INTERVAL,
  )

  const array: T[] = []
  for await (const line of rl) {
    const object = JSON.parse(line)
    array.push(object)
  }

  clearInterval(updater)
  eta.setCurrentTask(fileStream.bytesRead)
  eta.finish()

  return array
}

export const writeJsonl = async <T>(path: string, objects: T[]) => {
  const eta = new TrackETA(objects.length)
  const fileStream = fs.createWriteStream(path, { flags: 'w' })

  return new Promise((resolve, reject) => {
    let task = 0
    const PERCENT = Math.round(objects.length / 100)
    for (const object of objects) {
      fileStream.write(`${JSON.stringify(object)}\n`)
      task++
      if (task % PERCENT === 0) {
        eta.setCurrentTask(task)
      }
    }
    fileStream.end()
    fileStream.on('finish', () => {
      eta.setCurrentTask(task)
      eta.finish()
      resolve(true)
    })
    fileStream.on('error', reject)
  })
}
