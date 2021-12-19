import { Timestamp } from './Timestamp'
import { ColorKey } from './types'

const TAB = '  └> '
const CLEAR_REST_OF_LINE = '\x1b[K'
const NEWLINE = '\n'
const newline = () => `${CLEAR_REST_OF_LINE}${NEWLINE}`

class TerminalStream {
  constructor() {
    process.stdout.write(`${this.footerText}${newline()}`)
  }

  private footerText = ''

  public log = (message: string) => {
    process.stdout.moveCursor(0, -1)
    process.stdout.write(`${message}${newline()}${this.footerText}${newline()}`)
  }

  public setFooterText = (value: string) => {
    this.footerText = value
    process.stdout.moveCursor(0, -1)
    process.stdout.write(`${value}${newline()}`)
  }
}

class Logger {
  private stream = new TerminalStream()

  public log = (message: string) => {
    this.stream.log(message)
  }

  public broadcast = (text: string | number, color: ColorKey) => {
    const message = `${Timestamp.now(color)} ${text}`
    this.log(message)
  }

  public tabBroadcast: typeof this.broadcast = (text, ...args) => {
    this.broadcast(`${TAB} ${text}`, ...args)
  }

  public setFooterText = this.stream.setFooterText
}

export const logger = new Logger()
