import { coloredText } from 'logging'

export const printFilename = (filename: string) =>
  coloredText(filename, 'highlight')
