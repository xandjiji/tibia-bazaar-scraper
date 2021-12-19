import { coloredText } from './coloredText'
import { ColorKey } from '../types'

const MAX_WIDTH = 8
const FILL = '■'
const EMPTY = ' '

const print = (length: number, character: string): string =>
  Array.from({ length }, () => character).join('')

export const progressBar = (
  percentage: number,
  color: ColorKey = 'highlight',
): string => {
  const filled = Math.round(MAX_WIDTH * percentage)
  const unfilled = MAX_WIDTH - filled

  return `[${print(filled, coloredText(FILL, color))}${print(unfilled, EMPTY)}]`
}
