import fetch, { Headers } from 'node-fetch'
import UserAgent from 'user-agents'
import FormData from 'form-data'
import { PostHtmlProps, RequestTypes, requestTypeKeys } from './types'

const ENDPOINT =
  'https://www.tibia.com/websiteservices/handle_charactertrades.php'

export const postHtml = async ({
  auctionId,
  pageIndex,
  type,
}: PostHtmlProps) => {
  const headers = new Headers()
  headers.set('X-Requested-With', 'XMLHttpRequest')
  headers.set('User-Agent', new UserAgent().toString())

  const body = new FormData()
  body.append('auctionid', auctionId)
  body.append('currentpage', pageIndex)
  body.append('type', requestTypeKeys[type])

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body,
  })

  if (response.status !== 200) {
    throw new Error(
      `fetchHtml() recieved a bad status code [${response.status}]`,
    )
  }

  const data = await response.json()
  const [ajaxObject] = data.AjaxObjects
  return ajaxObject.Data as string
}
