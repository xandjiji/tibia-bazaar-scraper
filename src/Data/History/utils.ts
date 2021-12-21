import { coloredText } from 'logging'

export const printFilename = (filename: string) =>
  coloredText(filename, 'highlight')

export const getId = <T extends { id: number }>(auction: T) => auction.id
