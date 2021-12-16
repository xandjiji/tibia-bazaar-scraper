import {
  colors,
  ColorKey,
  MILLISECONDS_IN_A_SECOND,
  MILLISECONDS_IN_A_MINUTE,
  MILLISECONDS_IN_AN_HOUR,
} from './types'

export const coloredText = (text: string | number, color: ColorKey): string => {
  return `${colors[color]}${text}${colors['reset']}`
}

export const getTimestamp = (color: ColorKey = 'reset'): string => {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  return coloredText(`[${timestamp}]`, color)
}

export const colorProgress = (
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
