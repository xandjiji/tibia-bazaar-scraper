import {
  colors,
  ColorKey,
  TimeObject,
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

const calcTimeObject = (timestamp: number): TimeObject => {
  let millisecondsLeft = timestamp

  const hours = Math.floor(millisecondsLeft / MILLISECONDS_IN_AN_HOUR)

  millisecondsLeft -= hours * MILLISECONDS_IN_AN_HOUR
  const minutes = Math.floor(millisecondsLeft / MILLISECONDS_IN_A_MINUTE)

  millisecondsLeft -= minutes * MILLISECONDS_IN_A_MINUTE
  const seconds = Math.floor(millisecondsLeft / MILLISECONDS_IN_A_SECOND)

  return { hours, minutes, seconds }
}

const plural = (count: number): string => (count > 1 ? 's' : '')

export const humanReadableTimestamp = (timestamp: number) => {
  const { hours, seconds, minutes } = calcTimeObject(timestamp)

  const hoursString = hours
    ? `${coloredText(hours, 'highlight')} hour${plural(hours)}, `
    : ''
  const minutesString = minutes
    ? `${coloredText(minutes, 'highlight')} minute${plural(minutes)} and `
    : ''
  const secondsString = seconds
    ? `${coloredText(seconds, 'highlight')} second${plural(seconds)}`
    : ''

  return `${hoursString}${minutesString}${secondsString}`
}

const checkHours = (timestamp: number) => timestamp > MILLISECONDS_IN_AN_HOUR
const checkMinutes = (timestamp: number) => timestamp > MILLISECONDS_IN_A_MINUTE
const checkSeconds = (timestamp: number) => timestamp > MILLISECONDS_IN_A_SECOND

export const etaTimestamp = (timestamp: number) => {
  const { hours, minutes, seconds } = calcTimeObject(timestamp)

  const hoursString = checkHours(timestamp)
    ? `${coloredText(hours, 'neutral')}h `
    : ''
  const minutesString = checkMinutes(timestamp)
    ? `${coloredText(minutes, 'neutral')}m  `
    : ''
  const secondsString = checkSeconds(timestamp)
    ? `${coloredText(seconds, 'neutral')}s`
    : ''
  const leftString = secondsString ? ' left' : ''

  return `${hoursString}${minutesString}${secondsString}${leftString}`
}
