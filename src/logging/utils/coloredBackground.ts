import { bgColors, BGColorKey } from '../types'

export const coloredBackground = (
  text: string | number,
  color: BGColorKey,
): string => {
  return `${bgColors[color]}${text}${bgColors['reset']}`
}
