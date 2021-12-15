import { fetchHtml, retryWrapper } from 'utils'

const SERVER_LIST_URL = 'https://www.tibia.com/community/?subtopic=worlds'

export const fetchServerPage = retryWrapper(() => fetchHtml(SERVER_LIST_URL))
