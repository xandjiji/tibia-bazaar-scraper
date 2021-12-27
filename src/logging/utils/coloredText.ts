import { colors, ColorKey } from '../types'

export const coloredText = (text: string | number, color: ColorKey): string => {
  return `${colors[color]}${text}${colors['reset']}`
}
