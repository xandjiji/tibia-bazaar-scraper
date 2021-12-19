import { logger } from './Logger'
export * from './TrackETA'
export * from './Timer'
export { coloredText, coloredProgress } from './utils/'

export const { log, broadcast, bumpBroadcast, setFooterText } = logger
