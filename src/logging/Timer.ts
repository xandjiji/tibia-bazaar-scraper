import { Timestamp } from './Timestamp'

export class Timer {
  constructor() {
    this.startTimestamp = +new Date()
  }

  private startTimestamp: number = 0

  elapsedTime = () => Timestamp.humanReadable(+new Date() - this.startTimestamp)
}
