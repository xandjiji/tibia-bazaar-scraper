import { getTimestamp, coloredText, colorProgress } from './utils'
import { ColorKey } from './types'

export * from './BroadcastETA'
export * from './Timer'

export { coloredText, colorProgress }

export const broadcast = (text: string | number, color: ColorKey) => {
  console.log(`${getTimestamp(color)} ${text}`)
}

export const bumpBroadcast: typeof broadcast = (...args) => {
  console.group()
  broadcast(...args)
  console.groupEnd()
}
