import { logging, sleep } from 'utils'
import { requests } from 'Constants'

const DELAY_BASE = 2
const MILLISECONDS = 1000

const exponentialBackoffDelay = async (retry: number): Promise<void> => {
  if (retry > 0) {
    const magnitude = requests.MAX_RETRIES - retry
    const exponentialDelay = Math.pow(DELAY_BASE, magnitude) * MILLISECONDS

    logging.broadcast(`Next retry in ${exponentialDelay}ms`, 'control')
    await sleep(exponentialDelay)
  }
}

const retryCall = async <T>(
  callback: () => Promise<T>,
  retries = requests.MAX_RETRIES,
): Promise<T> => {
  if (retries > 0) {
    try {
      return await callback()
    } catch (error) {
      logging.broadcast('ERROR! Trying again...', 'fail')

      const retriesLeft = retries - 1
      await exponentialBackoffDelay(retriesLeft)
      return retryCall(callback, retriesLeft)
    }
  } else {
    logging.broadcast('Max tries reached', 'control')
    process.exit()
  }
}

export const retryWrapper = <F extends (...args: any[]) => any>(
  callback: F,
) => {
  const wrapped = async (...args: Parameters<F>) =>
    await retryCall(() => callback(...args))

  return wrapped as (...args: Parameters<F>) => Promise<ReturnType<F>>
}
