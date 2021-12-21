import { broadcast, coloredText, coloredProgress, TrackETA } from 'logging'
import { sleep } from '../sleep'
import { retryWrapper } from '../retryWrapper'
import { batchPromises } from '../batchPromises'

const DEFAULT_AMOUNT = 100
const BASE_DELAY = 1500

export const mockedPromise = retryWrapper(async (errorChance = 0.05) => {
  await sleep(BASE_DELAY * Math.random())

  if (errorChance > Math.random()) {
    throw 'error'
  } else {
    return
  }
})

export const runMockedRequests = async (
  amount = DEFAULT_AMOUNT,
  errorChance?: number,
) => {
  const eta = new TrackETA(amount, coloredText('Mocked requests', 'highlight'))
  const tasks = Array.from(
    { length: amount },
    (_, currentIndex) => async () => {
      const currentTask = currentIndex + 1

      broadcast(
        `Mocking request ${coloredProgress([currentTask, amount])}`,
        'neutral',
      )
      await mockedPromise(errorChance)
      eta.incTask()
    },
  )
  await batchPromises(tasks)
  eta.finish()
}