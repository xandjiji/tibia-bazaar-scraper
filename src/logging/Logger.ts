import { getTimestamp } from './utils'
import { ColorKey } from './types'

class Logger {
  private footerText: string | null = null

  private log = (message: string) => {
    const hasFooterText = this.footerText !== null
    if (hasFooterText) {
      process.stdout.moveCursor(0, -1)
      process.stdout.clearLine(-1)
    }

    console.log(message)

    if (hasFooterText) {
      console.log(this.footerText)
    }
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

  public setFooterText = (value: string) => {
    this.footerText = value
  }

  public clearFooterText = () => (this.footerText = null)
}

export const logger = new Logger()

export const footer = {
  setText: logger.setFooterText,
  clear: logger.clearFooterText,
}
