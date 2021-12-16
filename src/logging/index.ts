import {
  getTimestamp,
  coloredText,
  colorProgress,
  humanReadableTimestamp,
} from './utils'
import { Timer, ColorKey } from './types'

const broadcast = (text: string | number, color: ColorKey) => {
  console.log(`${getTimestamp(color)} ${text}`)
}

const bumpBroadcast: typeof broadcast = (...args) => {
  console.group()
  broadcast(...args)
  console.groupEnd()
}

class logging {
  timers: Timer[] = []

  static broadcast = broadcast
  static bumpBroadcast = bumpBroadcast

  setTimer = (key: string) => {
    const timer = this.timers.find((timer) => timer.key === key)
    if (timer) {
      throw `Timer key '${key}' already being used`
    }

    this.timers.push({
      key,
      timestamp: +new Date(),
    })
  }

  stopTimer = (key: string) => {
    const timer = this.timers.find((timer) => timer.key === key)
    if (!timer) {
      throw `Timer key '${key}' not found`
    }

    this.timers = this.timers.filter((timer) => timer.key === key)

    return humanReadableTimestamp(+new Date() - timer.timestamp)
  }
}

export default {
  coloredText,
  colorProgress,
  logging,
}
