export const MILLISECONDS_IN_A_SECOND = 1000
export const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * 60
export const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60

export const colors = {
  reset: '\x1b[0m', // white
  fail: '\x1b[31m', // red
  success: '\x1b[32m', // green
  highlight: '\x1b[33m', // yellow
  system: '\x1b[35m', // magenta
  neutral: '\x1b[36m', // cian
  control: '\x1b[90m', // gray
} as const

export type ColorKey = keyof typeof colors
