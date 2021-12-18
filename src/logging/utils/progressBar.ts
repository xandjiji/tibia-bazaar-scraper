import { coloredText } from './coloredText'
const MAX_WIDTH = 8
const FILL = coloredText('■', 'highlight')
const EMPTY = ' '

const print = (length: number, character: string): string =>
  Array.from({ length }, () => character).join('')

export const progressBar = (percentage: number): string => {
  const filled = Math.round(MAX_WIDTH * percentage)
  const unfilled = MAX_WIDTH - filled

  return `[${print(filled, FILL)}${print(unfilled, EMPTY)}]`
}
