import { coloredText } from './coloredText'
import { ColorKey } from '../types'

const MAX_WIDTH = 8
const BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█']
const FILL = BLOCKS[BLOCKS.length - 1]
const [EMPTY] = BLOCKS

const print = (length: number, character: string): string =>
  Array.from({ length }, () => character).join('')

export const progressBar = (
  percentage: number,
  color: ColorKey = 'highlight',
): string => {
  const filled = Math.floor(MAX_WIDTH * percentage)
  const fill = print(filled, coloredText(FILL, color))

  if (filled === MAX_WIDTH) return `[${fill}]`

  const fractionalBlockIndex =
    Math.round(MAX_WIDTH * BLOCKS.length * percentage) % BLOCKS.length

  const fraction = coloredText(BLOCKS[fractionalBlockIndex], color)

  const unfilled = MAX_WIDTH - filled
  const rest = print(unfilled - 1, EMPTY)

  return `[${fill}${fraction}${rest}]`
}
