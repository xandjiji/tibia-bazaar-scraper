import { logging, sleep } from 'utils'
import { requests } from 'Constants'

const retryCall = async <T>(
  callback: () => Promise<T>,
  retries = requests.MAX_RETRIES,
): Promise<T> => {
  if (retries > 0) {
    try {
      return await callback()
    } catch (error) {
      logging.broadcast('ERROR! Trying again...', 'fail')
      if (requests.DELAY > 0) await sleep(requests.DELAY)
      return retryCall(callback, retries - 1)
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
