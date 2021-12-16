const DEFAULT_CONFIG = {
  DELAY: 250,
  MAX_CONCURRENT_REQUESTS: 2,
  MAX_RETRIES: 5,
}

const SLOW_CONFIG = {
  DELAY: 3000,
  MAX_CONCURRENT_REQUESTS: 1,
  MAX_RETRIES: 5,
}

export const requests = process.env.SLOW_MODE ? SLOW_CONFIG : DEFAULT_CONFIG
