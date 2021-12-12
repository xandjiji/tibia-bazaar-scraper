const colors = {
  reset: '\x1b[0m', // white
  fail: '\x1b[31m', // red
  success: '\x1b[32m', // green
  highlight: '\x1b[33m', // yellow
  system: '\x1b[35m', // magenta
  neutral: '\x1b[36m', // cian
  control: '\x1b[90m', // gray
} as const

type ColorKey = keyof typeof colors

const coloredText = (text: string, color: ColorKey): string => {
  return `${colors[color]}${text}${colors['reset']}`
}

const getTimestamp = (): string =>
  `[${new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })}]`

const broadcast = (text: string, color: ColorKey) =>
  console.log(`${coloredText(getTimestamp(), color)} ${text}`)

export default { coloredText, getTimestamp, broadcast }
