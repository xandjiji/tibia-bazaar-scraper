import { getTimestamp } from './utils'
import { ColorKey } from './types'

class FooterStream {
  constructor() {
    this.printStream()
  }

  private text = ''

  private clearStream = () => {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
  }

  private printStream = () => {
    console.log(this.text)
  }

  public safeLog = (callback: Function) => {
    this.clearStream()
    callback()
    this.printStream()
  }

  public setText = (value: string) => {
    this.text = value
    this.clearStream()
    this.printStream()
  }
}

class Logger {
  private footerStream = new FooterStream()

  private log = (message: string) => {
    this.footerStream.safeLog(() => console.log(message))
  }

  public broadcast = (text: string | number, color: ColorKey) => {
    const message = `${getTimestamp(color)} ${text}`
    this.log(message)
  }

  public bumpBroadcast: typeof this.broadcast = (...args) => {
    console.group()
    this.broadcast(...args)
    console.groupEnd()
  }

  public setFooterText = this.footerStream.setText
}

export const logger = new Logger()
