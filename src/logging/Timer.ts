import { humanReadableTimestamp } from './utils'

export class Timer {
  constructor() {
    this.startTimestamp = +new Date()
  }

  private startTimestamp: number = 0

  elapsedTime = () => humanReadableTimestamp(+new Date() - this.startTimestamp)
}
