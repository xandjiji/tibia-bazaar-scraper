import {
  getTimestamp,
  coloredText,
  colorProgress,
  humanReadableTimestamp,
} from './utils'
import { ColorKey } from './types'

export const broadcast = (text: string | number, color: ColorKey) => {
  console.log(`${getTimestamp(color)} ${text}`)
}

export const bumpBroadcast: typeof broadcast = (...args) => {
  console.group()
  broadcast(...args)
  console.groupEnd()
}

export class Timer {
  timestamp: number = 0
  setTimer = () => (this.timestamp = +new Date())
  stopTimer = () => humanReadableTimestamp(+new Date() - this.timestamp)
}

export { coloredText, colorProgress }
