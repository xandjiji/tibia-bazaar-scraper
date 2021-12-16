const MILLISECONDS_IN_A_SECOND = 1000
const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * 60
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60

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

const coloredText = (text: string | number, color: ColorKey): string => {
  return `${colors[color]}${text}${colors['reset']}`
}

const getTimestamp = (color: ColorKey = 'reset'): string => {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  return coloredText(`[${timestamp}]`, color)
}

const colorProgress = (
  [current, last]: [number, number],
  color: ColorKey = 'system',
): string =>
  `${coloredText('[', color)}${current}${coloredText(
    '/',
    color,
  )}${last}${coloredText(']', color)}`

export const humanReadableTimestamp = (timestamp: number) => {
  let millisecondsLeft = timestamp

  const hours = Math.floor(millisecondsLeft / MILLISECONDS_IN_AN_HOUR)

  millisecondsLeft -= hours * MILLISECONDS_IN_AN_HOUR
  const minutes = Math.floor(millisecondsLeft / MILLISECONDS_IN_A_MINUTE)

  millisecondsLeft -= minutes * MILLISECONDS_IN_A_MINUTE
  const seconds = Math.floor(millisecondsLeft / MILLISECONDS_IN_A_SECOND)

  const hoursString = hours
    ? `${coloredText(hours, 'highlight')} hour${hours > 1 ? 's' : ''}, `
    : ''
  const minutesString = minutes
    ? `${coloredText(minutes, 'highlight')} minute${
        minutes > 1 ? 's' : ''
      } and `
    : ''
  const secondsString = seconds
    ? `${coloredText(seconds, 'highlight')} second${seconds > 1 ? 's' : ''}`
    : ''

  return `${hoursString}${minutesString}${secondsString}`
}

const broadcast = (text: string | number, color: ColorKey) =>
  console.log(`${getTimestamp(color)} ${text}`)

const bumpBroadcast: typeof broadcast = (...args) => {
  console.group()
  broadcast(...args)
  console.groupEnd()
}

export default {
  coloredText,
  getTimestamp,
  colorProgress,
  humanReadableTimestamp,
  bumpBroadcast,
  broadcast,
}
