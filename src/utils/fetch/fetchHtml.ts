import UserAgent from 'user-agents'
import fetch from 'node-fetch'

export const fetchHtml = async (url: string) => {
  const userAgent = new UserAgent()
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent.toString(),
    },
  })

  if (response.status !== 200) {
    throw new Error(
      `fetchHtml() recieved a bad status code [${response.status}]`,
    )
  }

  return await response.text()
}
